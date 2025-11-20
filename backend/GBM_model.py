import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import cross_val_score, RepeatedKFold
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib
import matplotlib.pyplot as plt
import pickle
import tempfile

matplotlib.use('agg')  # Use non-GUI backend

def gbmRakha3(fn, selectedInputHeaders, selectedOutputHeaders, n_estimators, max_depth, loss, criterion, learning_rate):
    try:
        # Read CSV input file
        fedf = pd.read_csv(fn)
        # Drop rows with all zeros
        fedf = fedf.loc[(fedf != 0).any(axis=1)]
        fedf = fedf[fedf[selectedOutputHeaders[0]] != 0]
        fedf = fedf.loc[:, selectedInputHeaders + selectedOutputHeaders]

        # Creating feature variables
        X = fedf.drop(selectedOutputHeaders, axis=1).to_numpy()
        y = fedf[selectedOutputHeaders].values.ravel()

        # Gradient Boosting Regressor
        model = GradientBoostingRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            loss=loss,
            learning_rate=learning_rate,
            criterion=criterion
        )

        # Cross-validation
        cv = RepeatedKFold(n_splits=10, n_repeats=3, random_state=1)
        n_scores = cross_val_score(model, X, y, scoring='neg_mean_absolute_error', cv=cv, n_jobs=-1, error_score='raise')

        # Fit the model on the entire dataset
        model.fit(X, y)

        # Save the model
        filename = 'gbm_model.sav'
        pickle.dump(model, open(filename, 'wb'))

        # Predictions and MSE
        predictions = model.predict(X)
        mse = mean_squared_error(y, predictions)
        r2 = r2_score(y, predictions)
        print(f"Mean Squared Error (MSE): {mse}")
        print(f"R-squared (R²): {r2}")

        # Regression line calculation
        slope, intercept = np.polyfit(y, predictions, 1)
        reg_line_eq = f"y = {slope:.2f}x + {intercept:.2f}"
        print(f"Regression Line: {reg_line_eq}")

        # Plot Actual vs Predicted
        plt.figure()
        plt.scatter(y, predictions, color='purple', label="Data Points")
        plt.plot(y, slope * y + intercept, color='red', label=f"Regression Line: {reg_line_eq}")
        plt.xlabel("Actual Values")
        plt.ylabel("Predicted Values")
        plt.title(f"GBM Model: Actual vs Predicted\nR² = {r2:.2f}")
        plt.legend()
        plt.tight_layout()

        # Save the plot
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        plt.savefig(temp_file.name)
        plt.close()

        return temp_file.name

    except Exception as e:
        print(f"Error in gbmRakha3: {e}")
        return None

def gbmRakhaTest3(csvData, selectedInputHeaders, selectedOutputHeaders):
    try:
        # Load the trained model
        filename = 'gbm_model.sav'
        model = pickle.load(open(filename, 'rb'))

        # Read CSV data
        df = pd.read_csv(csvData)
        df.columns = df.columns.str.strip()  # Strip whitespace from column names

        # Proceed with data processing
        df = df.loc[(df != 0).any(axis=1)]
        df = df[df[selectedOutputHeaders[0]] != 0]
        df = df.loc[:, selectedInputHeaders + selectedOutputHeaders]

        # Feature variables
        X = df.drop(selectedOutputHeaders, axis=1).to_numpy()
        y = df[selectedOutputHeaders].values.ravel()

        # Make predictions
        predictions = model.predict(X)

        # Add predictions to the DataFrame
        df[f'Predicted_{selectedOutputHeaders[0]}'] = predictions

        # Save the predictions to a CSV file
        outfile = 'gbm_model_predictions.csv'
        df.to_csv(outfile, index=False)

        # Calculate R² score
        r2 = r2_score(y, predictions)
        slope, intercept = np.polyfit(y, predictions, 1)
        reg_line_eq = f"y = {slope:.2f}x + {intercept:.2f}"
        print(f"R-squared (R²) on test data: {r2}")
        print(f"Regression Line: {reg_line_eq}")

        # Plot Actual vs Predicted
        plt.figure()
        plt.scatter(y, predictions, color='green', label="Data Points")
        plt.plot(y, slope * y + intercept, color='red', label=f"Regression Line: {reg_line_eq}")
        plt.xlabel("Actual Values")
        plt.ylabel("Predicted Values")
        plt.title(f"GBM Model Test: Actual vs Predicted\nR² = {r2:.2f}")
        plt.legend()
        plt.tight_layout()

        # Save the plot to a temporary PNG file
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        plt.savefig(temp_file.name)
        plt.close()

        # Return both the CSV file path and the PNG plot file path
        return outfile, temp_file.name

    except Exception as e:
        print(f"Error in gbmRakhaTest3: {e}")
        return None, None
