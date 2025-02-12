from flask import Flask, jsonify
import os
import sys

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({
        'status': 'success',
        'message': 'Server is running',
        'python_version': sys.version,
        'cwd': os.getcwd(),
        'file_path': __file__
    })

if __name__ == '__main__':
    print(f"Python Version: {sys.version}")
    print(f"Current Working Directory: {os.getcwd()}")
    print(f"Script Location: {__file__}")
    app.run(host='0.0.0.0', port=5000, debug=True)
