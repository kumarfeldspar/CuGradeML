# app.py

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from GBMREG import gbmRakha, gbmRakhaTest
from GBM_model import gbmRakha3, gbmRakhaTest3
from Random_Forest import rf3, rfTest3
import os
import tempfile
import zipfile
from io import BytesIO
import traceback

app = Flask(__name__)
CORS(app)

@app.route('/test', methods=['POST'])
def test_data():
    try:
        # Extract common data
        csvData = request.files['csvData']
        model = request.form['model']
        selectedInputHeaders = request.form['selectedInputHeaders'].split(',')
        selectedOutputHeaders = request.form['selectedOutputHeaders'].split(',')

        # Determine the model type and call the appropriate test function
        if model == "GBMREG":
            output_csv, output_img = gbmRakhaTest(csvData, selectedInputHeaders, selectedOutputHeaders)
        elif model == "GBM_MODEL":
            output_csv, output_img = gbmRakhaTest3(csvData, selectedInputHeaders, selectedOutputHeaders)
        elif model == "RandomForest":
            # Random Forest-specific testing parameters
            rf_t1 = request.form.get('rf_t1', default=None)
            rf_t2 = request.form.get('rf_t2', default=None)
            rf_t3 = request.form.get('rf_t3', default=None)
            rf_t4 = request.form.get('rf_t4', default=None)
            rf_t5 = request.form.get('rf_t5', default=None)
            rf_t6 = request.form.get('rf_t6', default=None)
            output_csv, output_img = rfTest3(
                csvData, 
                selectedInputHeaders, 
                selectedOutputHeaders, 
                rf_t1, rf_t2, rf_t3, rf_t4, rf_t5, rf_t6
            )
        else:
            return jsonify({'result': 'Unsupported model type'}), 400

        if not output_csv:
            return jsonify({'result': 'Processing failed'}), 500

        if not output_img:
            # If there's no image, just send the CSV
            return send_file(
                output_csv,
                mimetype='text/csv',
                as_attachment=True,
                download_name='test_results.csv'
            )
        
        # Create a zip file in memory
        memory_file = BytesIO()
        with zipfile.ZipFile(memory_file, 'w') as zipf:
            zipf.write(output_csv, os.path.basename(output_csv))
            if output_img:
                zipf.write(output_img, os.path.basename(output_img))

        # Move pointer to the beginning of the BytesIO buffer
        memory_file.seek(0)

        # Send the zip file as the response
        return send_file(
            memory_file,
            mimetype='application/zip',
            as_attachment=True,
            download_name='test_results.zip'
        )

    except Exception as e:
        # print(f"Error in test_data: {e}")
        traceback.print_exc()
        return jsonify({'result': 'Server error'}), 500

@app.route('/train', methods=['POST'])
def train_data():
    try:
        # Extract common data
        csvData = request.files['csvData']
        model = request.form['model']
        selectedInputHeaders = request.form['selectedInputHeaders'].split(',')
        selectedOutputHeaders = request.form['selectedOutputHeaders'].split(',')

        # Determine the model type and call the appropriate training function
        if model == "GBMREG":
            # Extract GBMREG-specific parameters
            gbmreg_n_estimators = int(request.form.get('gbmreg_n_estimators', 100))
            gbmreg_max_depth = int(request.form.get('gbmreg_max_depth', 3))
            gbmreg_loss = request.form.get('gbmreg_loss', 'squared_error')
            gbmreg_learning_rate = float(request.form.get('gbmreg_learning_rate', 0.1))
            gbmreg_criterion = request.form.get('gbmreg_criterion', 'friedman_mse')
            
            # Call GBMREG training function
            plot_path = gbmRakha(
                csvData, 
                selectedInputHeaders, 
                selectedOutputHeaders, 
                gbmreg_n_estimators, 
                gbmreg_max_depth, 
                gbmreg_loss, 
                gbmreg_criterion, 
                gbmreg_learning_rate
            )
            if not plot_path or not os.path.exists(plot_path):
                return jsonify({'result': 'Training failed'}), 500
            # Return the plot image
            return send_file(
                plot_path,
                mimetype='image/png',
                as_attachment=True,
                download_name='gbmreg_training_plot.png'
            )
        
        elif model == "GBM_MODEL":
            # Extract GBM_MODEL-specific parameters
            gbm_model_n_estimators = int(request.form.get('gbm_model_n_estimators', 100))
            gbm_model_max_depth = int(request.form.get('gbm_model_max_depth', 3))
            gbm_model_loss = request.form.get('gbm_model_loss', 'squared_error')
            gbm_model_learning_rate = float(request.form.get('gbm_model_learning_rate', 0.1))
            gbm_model_criterion = request.form.get('gbm_model_criterion', 'friedman_mse')
            
            # Call GBM_MODEL training function
            plot_path = gbmRakha3(
                csvData, 
                selectedInputHeaders, 
                selectedOutputHeaders, 
                gbm_model_n_estimators, 
                gbm_model_max_depth, 
                gbm_model_loss, 
                gbm_model_criterion, 
                gbm_model_learning_rate
            )
            if not plot_path or not os.path.exists(plot_path):
                return jsonify({'result': 'Training failed'}), 500
            # Return the plot image
            return send_file(
                plot_path,
                mimetype='image/png',
                as_attachment=True,
                download_name='gbm_model_training_plot.png'
            )
        
        elif model == "RandomForest":
            # Extract Random Forest specific parameters
            rf_n_estimators = int(request.form.get('rf_n_estimators', 10))
            rf_criterion = request.form.get('rf_criterion', 'squared_error')
            # print(rf_criterion, type(rf_criterion),"poiuyt")
            rf_max_features = request.form.get('rf_max_features', 'log2')
            if rf_max_features == "None":
                rf_max_features = None
            rf_max_depth = request.form.get('rf_max_depth', 20)
            rf_max_depth = int(rf_max_depth) if rf_max_depth else None
            rf_bootstrap = request.form.get('rf_bootstrap', 'True') == 'True'
            rf_min_samples_leaf = int(request.form.get('rf_min_samples_leaf', 1))
            rf_min_samples_split = int(request.form.get('rf_min_samples_split', 2))
            
            # Prepare parameters dictionary
            params = {
                'n_estimators': rf_n_estimators,
                'criterion': rf_criterion,
                'max_depth': rf_max_depth,
                'max_features': rf_max_features,
                'bootstrap': rf_bootstrap,
                'min_samples_leaf': rf_min_samples_leaf,
                'min_samples_split': rf_min_samples_split
            }
            print(params)
            
            # Call Random Forest training function
            training_result = rf3(
                csvData,
                selectedInputHeaders,
                selectedOutputHeaders,
                params,
                split_params={}  # Adjust if you have split_params
            )
            if not training_result or not os.path.exists(training_result):
                return jsonify({'result': 'Training failed'}), 500
            
            return send_file(
                training_result,
                mimetype='image/png',
                as_attachment=True,
                download_name='Random_Forest_training_plot.png'
            )
            
        else:
            return jsonify({'result': 'Unsupported model type'}), 400

    except Exception as e:
        # Print the full stack trace for debugging
        print(f"Error in train_data: {e}")
        traceback.print_exc()
        return jsonify({'result': 'Server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8001)
