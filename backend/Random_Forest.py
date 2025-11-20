

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import matplotlib
import matplotlib.pyplot as plt
import pickle
import tempfile
import os

matplotlib.use('agg')  # Use non-GUI backend

def rf3(csvData, selectedInputHeaders, selectedOutputHeaders, params, split_params):
    try:
        # Read CSV data
        df = pd.read_csv(csvData)

        # Feature and target variables
        X = df[selectedInputHeaders].values
        y = df[selectedOutputHeaders].values.ravel()

        # Initialize the model with parameters
        regr = RandomForestRegressor(
            n_estimators=params.get('n_estimators', 100),
            criterion=params.get('criterion', 'squared_error'),  
            max_depth=params.get('max_depth', 20),
            max_features=params.get('max_features', 'sqrt'),
            bootstrap=params.get('bootstrap', True),
            min_samples_leaf=params.get('min_samples_leaf', 1),
            min_samples_split=params.get('min_samples_split', 2),
            random_state=42  # For reproducibility
        )

        # Train the model
        regr.fit(X, y)

        # Save the model
        model_filename = 'rf_model.sav'
        with open(model_filename, 'wb') as model_file:
            pickle.dump(regr, model_file)

        # Predictions and MSE on training data
        predictions = regr.predict(X)
        mse = mean_squared_error(y, predictions)
        r2 = r2_score(y, predictions)
        print(f"Mean Squared Error (MSE) on training data: {mse}")
        print(f"R-squared (R²) on training data: {r2}")

        # Regression line calculation
        slope, intercept = np.polyfit(y, predictions, 1)
        reg_line_eq = f"y = {slope:.2f}x + {intercept:.2f}"
        print(f"Regression Line: {reg_line_eq}")

        # Plot Actual vs Predicted
        plt.figure()
        plt.scatter(y, predictions, color='blue', label="Data Points")
        plt.plot(y, slope * y + intercept, color='red', label=f"Regression Line: {reg_line_eq}")
        plt.xlabel("Actual Values")
        plt.ylabel("Predicted Values")
        plt.title(f"Random Forest: Actual vs Predicted on Training Data\nR² = {r2:.2f}")
        plt.legend()
        plt.tight_layout()

        # Save the plot to a temporary PNG file
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        plt.savefig(temp_file.name)
        plt.close()

        return temp_file.name

    except Exception as e:
        print(f"Error in rf3: {e}")
        return None  # Return None to indicate failure

def rfTest3(csvData, selectedInputHeaders, selectedOutputHeaders, rf_t1=None, rf_t2=None, rf_t3=None, rf_t4=None, rf_t5=None, rf_t6=None):
    try:
        # Load the trained model
        model_filename = 'rf_model.sav'
        if not os.path.exists(model_filename):
            print(f"Model file {model_filename} does not exist.")
            return None, None

        with open(model_filename, 'rb') as model_file:
            regr = pickle.load(model_file)

        # Read CSV data and clean column names
        df = pd.read_csv(csvData)
        df.columns = df.columns.str.strip()

        # Remove all-zero rows and zero outputs (optional filtering)
        df = df.loc[(df != 0).any(axis=1)]
        df = df[df[selectedOutputHeaders[0]] != 0]

        # Select only holeid, inputs, and outputs
        df = df.loc[:, ['holeid'] + selectedInputHeaders + selectedOutputHeaders]

        # Prepare features and target
        X = df[selectedInputHeaders].to_numpy()
        y = df[selectedOutputHeaders].values.ravel()

        # Make predictions
        predictions = regr.predict(X)

        # Calculate R^2 and regression equation
        r2 = r2_score(y, predictions)
        slope, intercept = np.polyfit(y, predictions, 1)
        reg_line_eq = f"y = {slope:.2f}x + {intercept:.2f}"
        print(f"R-squared (R²) on test data: {r2}")
        print(f"Regression Line: {reg_line_eq}")

        # Add predictions to the DataFrame
        df[f'Predicted_{selectedOutputHeaders[0]}'] = predictions

        # Save the predictions (with holeid) to CSV
        outfile = 'rf_predictions.csv'
        df.to_csv(outfile, index=False)

        # Plot Actual vs Predicted
        plt.figure()
        plt.scatter(y, predictions, color='blue', label="Data Points")
        plt.plot(y, slope * y + intercept, color='red', linestyle="--", label=f"{reg_line_eq}\nR² = {r2:.2f}")
        plt.xlabel("Actual Values")
        plt.ylabel("Predicted Values")
        plt.title("Random Forest Test: Actual vs Predicted")
        plt.legend()
        plt.tight_layout()

        # Save the plot image
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        plt.savefig(temp_file.name)
        plt.close()

        # Return both the CSV file path and the PNG plot file path
        return outfile, temp_file.name

    except Exception as e:
        print(f"Error in rfTest3: {e}")
        return None, None