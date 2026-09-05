# Kinn — แอปสั่งอาหาร (Expo / React Native)

แปลงจากโปรเจกต์ตัวอย่าง "Meals" เดิม ให้เป็นแอปสั่งอาหารชื่อ **Kinn** โทนสีเขียว
(Pantone 19-6026 TCX "Verdant Green", `#12674A`) ตามที่อาจารย์กำหนด

## ✅ ครบตามข้อกำหนด

1. **Context (in-memory)** — `store/context/`
   - `cart-context.js` — ตะกร้าสินค้า (useReducer, อยู่ในหน่วยความจำ ล้างเมื่อสั่งซื้อสำเร็จ)
   - `favorite-context.js` — รายการโปรด (state ในหน่วยความจำ + sync ขึ้นคลาวด์)
   - `auth-context.js` — สถานะผู้ใช้ที่ล็อกอิน
   - `order-context.js` — แคชประวัติคำสั่งซื้อในหน่วยความจำ
2. **ฐานข้อมูลแบ็กเอนด์ (คลาวด์)** — ใช้ **Firebase Firestore**
   - `users/{uid}` เก็บโปรไฟล์ผู้ใช้ (ชื่อ, เบอร์, ที่อยู่)
   - `users/{uid}/orders/{orderId}` เก็บประวัติคำสั่งซื้อ
   - `favorites/{uid}` เก็บรายการโปรด
3. **การตรวจสอบสิทธิ์ผู้ใช้ (Authentication)** — ใช้ **Firebase Authentication** (Email/Password)
   - หน้า Login / Register อยู่ใน `screens/auth/`

## หน้าจอทั้งหมด

| หน้าจอ | ไฟล์ |
|---|---|
| Login | `screens/auth/LoginScreen.js` |
| Register | `screens/auth/RegisterScreen.js` |
| Home (รายการอาหาร + หมวดหมู่, bottom bar) | `screens/HomeScreen.js` |
| รายละเอียดเมนู (add favorite, add to cart) | `screens/MealDetailScreen.js` |
| ตะกร้า | `screens/CartScreen.js` |
| Checkout (ที่อยู่ + วิธีชำระเงิน) | `screens/CheckoutScreen.js` |
| สรุปคำสั่งซื้อ / ยืนยัน | `screens/OrderSummaryScreen.js` |
| สั่งซื้อสำเร็จ | `screens/OrderSuccessScreen.js` |
| ประวัติการสั่งซื้อ (bottom bar) | `screens/OrderHistoryScreen.js` |
| รายการโปรด (bottom bar) | `screens/FavoritesScreen.js` |
| โปรไฟล์ (bottom bar) | `screens/ProfileScreen.js` |

โฟลว์การสั่งซื้อ: **Home → เลือกเมนู → รายละเอียด/ใส่ตะกร้า → ตะกร้า → Checkout → สรุปคำสั่งซื้อ → ยืนยัน → สำเร็จ**

## 🔧 การตั้งค่า Firebase (ต้องทำก่อนรันแอป)

1. ไปที่ https://console.firebase.google.com แล้วสร้างโปรเจกต์ใหม่ (ฟรี)
2. เปิดใช้งาน **Authentication → Sign-in method → Email/Password**
3. เปิดใช้งาน **Firestore Database** (สร้างในโหมด "test mode" ระหว่างพัฒนา)
4. ไปที่ Project settings → General → "Your apps" → เพิ่มแอป Web (</> ) เพื่อรับค่า config
5. คัดลอกค่า config มาใส่ที่ไฟล์ `firebase/firebaseConfig.js` แทนค่า `YOUR_...`:

```js
const firebaseConfig = {
  apiKey: 'xxxx',
  authDomain: 'xxxx.firebaseapp.com',
  projectId: 'xxxx',
  storageBucket: 'xxxx.appspot.com',
  messagingSenderId: 'xxxx',
  appId: 'xxxx',
};
```

6. แนะนำตั้งกฎ Firestore (Rules) เบื้องต้นให้ผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตัวเอง:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /orders/{orderId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /favorites/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## รันโปรเจกต์

```bash
npm install
npx expo start
```

ไฟล์ราคาสินค้าอยู่ที่ `data/meal-data.js` (ตัวแปร `MENU_PRICES`) หากต้องการเพิ่ม/แก้ไขเมนู
สามารถแก้ไขที่ไฟล์นี้ได้โดยตรง
