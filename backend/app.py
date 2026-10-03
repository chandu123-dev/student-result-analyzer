import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS

from database import init_db
from models import StudentModel
from seed import seed_database

from routes.students import students_bp
from routes.rankings import rankings_bp
from routes.search import search_bp
from routes.graph import graph_bp
from routes.statistics import statistics_bp

def create_app() -> Flask:
    app = Flask(__name__)
    
    # Enable CORS for all routes (supporting Vite default http://localhost:5173, etc.)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(students_bp)
    app.register_blueprint(rankings_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(graph_bp)
    app.register_blueprint(statistics_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Student Result Analyzer Backend",
            "database": "SQLite",
            "version": "1.0.0"
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Endpoint not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"success": False, "error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "error": "Internal server error"}), 500

    # Auto-initialize and seed DB if empty
    with app.app_context():
        init_db()
        count = StudentModel.count()
        if count == 0:
            print("[INFO] Database is empty. Seeding initial student records...")
            seed_database(force=False)
        else:
            print(f"[INFO] Database initialized with {count} existing students.")

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] Starting Student Result Analyzer API on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
