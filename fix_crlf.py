import os

def convert_to_lf(filepath):
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Replace CRLF with LF
    if b'\r\n' in content:
        new_content = content.replace(b'\r\n', b'\n')
        with open(filepath, 'wb') as f:
            f.write(new_content)
        print(f"Converted: {filepath}")
    else:
        print(f"Skipped (already LF or no CRLF): {filepath}")

def main():
    start_dir = r"c:\Users\ROG\Desktop\platform\apps\contracts\contracts"
    for root, dirs, files in os.walk(start_dir):
        for file in files:
            if file.endswith(".clar"):
                filepath = os.path.join(root, file)
                convert_to_lf(filepath)

if __name__ == "__main__":
    main()
