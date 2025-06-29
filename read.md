/Users/stanislav/practical_web_dev_class/full_stack_open/part_2/practice/practice



"scripts": {
  "build:ui": "rm -rf dist && cd ../part3_practice_frontend && npm run build && cp -r dist ../part3_practice_backend",
  "deploy": "echo 'Manual deploy via Render UI or Git push — skipping deploy script.'",
  "deploy:full": "npm run build:ui && npm run deploy",
  "logs:prod": "echo 'Check logs in Render dashboard — fly logs not available.'"
}


runs in port 5173
