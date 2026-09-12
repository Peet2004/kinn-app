import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ใส่ Firebase Config ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyDeYE_rCkWLTORnrUiDaDaQvS8d4_cuIjo",
  authDomain: "kinn-4f2d6.firebaseapp.com",
  projectId: "kinn-4f2d6",
  storageBucket: "kinn-4f2d6.firebasestorage.app",
  messagingSenderId: "577349646449",
  appId: "1:577349646449:web:f8157bc558b86bc8c5c3d0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// วางข้อมูล categories และ meals JSON ที่แปลงแล้วไว้ตรงนี้
const categories = [
  { "id": "c12", "title": "Memes", "color": "#f54242" },
  
]; // เอาข้อมูล JSON หมวดหมู่มาวาง
const meals = [
  {
    "id": "m13",
    "categoryIds": ["c1", "c12"],
    "title": "Sussy Amongus",
    "affordability": "affordable",
    "complexity": "simple",
    "imageUrl": "https://pioneeroptimist.com/wp-content/uploads/2021/03/among-us-6008615_1920.png",
    "duration": 20,
    "ingredients": [
      "4 Tomatoes",
      "1 Tablespoon of Olive Oil",
      "1 Onion",
      "250g red",
      "Spices",
      "Cheese (optional)"
    ],
    "steps": [
      "Cut the tomatoes and the onion into small pieces.",
      "Boil some water - add salt to it once it boils.",
      "Put the spaghetti into the boiling water - they should be done in about 10 to 12 minutes.",
      "In the meantime, heaten up some olive oil and add the cut onion.",
      "After 2 minutes, add the tomato pieces, salt, pepper and your other spices.",
      "The sauce will be done once the spaghetti are.",
      "Feel free to add some cheese on top of the finished dish."
    ],
    "isGlutenFree": false,
    "isVegan": true,
    "isVegetarian": true,
    "isLactoseFree": true,
    "price": 6767
  },
  
  
];       // เอาข้อมูล JSON เมนูอาหารมาวาง

async function seedData() {
  try {
    console.log("กำลังอัปโหลด Categories...");
    for (const cat of categories) {
      await setDoc(doc(db, "categories", cat.id), cat);
    }

    console.log("กำลังอัปโหลด Meals...");
    for (const meal of meals) {
      await setDoc(doc(db, "meals", meal.id), meal);
    }

    console.log("อัปโหลดข้อมูลทั้งหมดเข้า Firestore สำเร็จเรียบร้อย!");
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลด: ", error);
  }
}

seedData();