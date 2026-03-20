#!/usr/bin/env python3
"""
로컬 개발용 프록시 서버
- 정적 파일 서빙 (port 8080)
- /api/claude 요청을 Anthropic API로 포워딩 (CORS 우회)
"""

import http.server
import urllib.request
import urllib.error
import json
import os

PORT = 8080


class ProxyHandler(http.server.SimpleHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/claude':
            self._proxy_to_anthropic()
        else:
            self.send_error(404, 'Not Found')

    def _proxy_to_anthropic(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        api_key = self.headers.get('x-api-key', '')
        anthropic_version = self.headers.get('anthropic-version', '2023-06-01')

        req = urllib.request.Request(
            'https://api.anthropic.com/v1/messages',
            data=body,
            headers={
                'Content-Type': 'application/json',
                'x-api-key': api_key,
                'anthropic-version': anthropic_version,
            },
            method='POST'
        )

        try:
            with urllib.request.urlopen(req) as resp:
                resp_body = resp.read()
                self.send_response(resp.status)
                self._send_cors_headers()
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(resp_body)
        except urllib.error.HTTPError as e:
            resp_body = e.read()
            self.send_response(e.code)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(resp_body)
        except Exception as e:
            self.send_response(500)
            self._send_cors_headers()
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version')

    def log_message(self, format, *args):
        if '/api/claude' in (args[0] if args else ''):
            super().log_message(format, *args)


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with http.server.ThreadingHTTPServer(('', PORT), ProxyHandler) as httpd:
        print(f'서버 시작: http://localhost:{PORT}')
        print('종료: Ctrl+C')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n서버 종료')
