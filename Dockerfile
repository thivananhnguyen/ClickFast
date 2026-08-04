FROM nginx:1.27-alpine

# Remove default nginx static files.
RUN rm -rf /usr/share/nginx/html/*

# Copy only files needed by the static app.
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/

EXPOSE 80
