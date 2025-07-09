import { db } from "@/db"
import { categories } from "@/db/schema"
const categoryNames = [
    "All",
    "Cars & Vehicles",
    "Electronics",
    "Fashion & Apparel",
    "Home & Garden",
    "Sports & Outdoors",
    "Health & Beauty",
    "Toys & Games",
    "Books & Literature",
    "Food & Beverages",
    "Music & Instruments",
    "Travel & Leisure",
    "Technology & Gadgets",
    "Art & Crafts",
    "Education & Learning",
    "Business & Finance",
    "Pets & Animals",
    "Movies & TV Shows",
    "Photography & Videography",
    "Gaming & Entertainment"
]

async function main(){
    console.log("Seeding")
    try{
        const val=categoryNames.map((cat)=>({
            name:cat,
            description:`Videos related to ${cat}`
        }))
        await db.insert(categories).values(val)
    }catch(err){
        console.error(err,"error")
        process.exit(1)
    }
}
main()