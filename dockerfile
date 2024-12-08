# Node.js resmi imajını kullan
FROM node:18

# Uygulama için çalışma dizini oluştur
WORKDIR /usr/src/app

# Backend dizinine gidiyoruz
WORKDIR /usr/src/app/backend

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Backend dosyalarını konteynıra kopyala
COPY backend ./

# Uygulamanın çalışacağı portu belirt
EXPOSE 5000

# Uygulamanızı başlat
CMD ["npm", "start"]
