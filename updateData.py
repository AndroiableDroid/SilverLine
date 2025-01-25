import pandas as pd
import json
import sys

def load_json(json_file):
    """Load the JSON file into a Python dictionary."""
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: The JSON file '{json_file}' does not exist.")
        return None
    except json.JSONDecodeError:
        print(f"Error: The JSON file '{json_file}' is not valid.")
        return None

def save_json(json_file, json_data):
    """Save the Python dictionary back to the JSON file."""
    try:
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=4)
        print(f"JSON file '{json_file}' successfully updated.")
    except Exception as e:
        print(f"Error saving JSON file: {e}")

def load_excel(file_name):
    """Load the Excel or CSV file into a pandas DataFrame."""
    try:
        if file_name.endswith(".xlsx"):
            return pd.read_excel(file_name, skiprows=4)  # Skip the first 4 rows
        elif file_name.endswith(".csv"):
            return pd.read_csv(file_name)
        else:
            print("Unsupported file type. Please provide a .csv or .xlsx file.")
            return None
    except FileNotFoundError:
        print(f"Error: The Excel file '{file_name}' does not exist.")
        return None
    except Exception as e:
        print(f"Error loading Excel file: {e}")
        return None

def update_json_with_excel(json_files, data_frame, category):
    """Update the JSON dictionary with the information from the Excel file."""
    # Check if the Excel file has the necessary columns
    if "Item No " not in data_frame.columns or "Description " not in data_frame.columns or "Finish" not in data_frame.columns:
        print("The Excel file must contain 'Item No', 'Description', and 'Finish' columns.")
        return None

    for product_code, description, finish in zip(data_frame["Item No "], data_frame["Description "], data_frame["Finish"]):
        product_code = str(product_code)  # Convert productCode to string if it's not already
        
        for json_file in json_files:
            json_data = load_json(json_file)
            if json_data:
                # Update the category dynamically
                if category in json_data:
                    for category_item in json_data[category].values():
                        for item in category_item:
                            if item["productCode"] == product_code:
                                item["description"] = description
                                item["Finish"] = finish

                # Save the updated JSON file
                save_json(json_file, json_data)

def main(json_files: list, excel_file, category):
    """Main function to update the JSON file with keys from the Excel file."""
    if not json_files:
        return

    data_frame = load_excel(excel_file)
    if data_frame is None:
        return

    update_json_with_excel(json_files, data_frame, category)

# Entry point
if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python script.py <excel_file> <category> <json_files>")
    else:
        excel_file = sys.argv[1]
        category = sys.argv[2]  # Category like 'home-decor', 'furniture', etc.
        json_files = sys.argv[3:]  # JSON files list
        main(json_files, excel_file, category)