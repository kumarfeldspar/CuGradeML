from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from GBMREG import gbmRakha, gbmRakhaTest
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/test', methods = ['POST'])
def test_data():
    try:
        csvData = request.files['csvData']
        t1 = request.form['t1']
        t2 = request.form['t2']
        t3 = request.form['t3']
        t4 = request.form['t4']
        t5 = request.form['t5']
        t6 = request.form['t6']
        selectedInputHeaders = request.form['selectedInputHeaders'].split(',')
        selectedOutputHeaders = request.form['selectedOutputHeaders'].split(',')
        output = gbmRakhaTest(csvData,t1,t2,t3,t4,t5,t6,selectedInputHeaders, selectedOutputHeaders)
        # return send_file(
        #     output,
        #     mimetype='text/csv',
        #     as_attachment=True,
        #     download_name='result.csv'
        # )
        resp = make_response(output)
        resp.headers["Content-Disposition"] = "attachment; filename=export.csv"
        resp.headers["Content-Type"] = "text/csv"
        return resp
    except Exception as e:
        return jsonify({'result': str(e)}), 500
    
@app.route('/train', methods = ['POST'])
def train_data():
    
    try:
        csvData = request.files['csvData']
        selectedInputHeaders = request.form['selectedInputHeaders'].split(',')
        selectedOutputHeaders = request.form['selectedOutputHeaders'].split(',')
        n_estimators = request.form['n_estimators']
        max_depth = request.form['max_depth']
        loss = request.form['loss']
        criterion = request.form['criterion']
        learning_rate = request.form['learning_rate']

        plot = gbmRakha(csvData, selectedInputHeaders, selectedOutputHeaders, n_estimators, max_depth, loss, criterion, learning_rate)
        return send_file(plot, mimetype='image/png')
        
    except Exception as e:
        return jsonify({'result': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=8001)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  # Default to port 5000 if not set
    app.run(host='0.0.0.0', port=port, debug=False)
