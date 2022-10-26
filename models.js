import mongoose from 'mongoose'

let models = {}

main()
async function main(){
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://admin:password12345@cluster0.9hfnw7i.mongodb.net/websharer')

    console.log("successfully connected to mongodb!")

    const postSchema = new mongoose.Schema({
        url: String,
        description: String,
        company: String,
        created_date: Date
    })
    
    models.Post = mongoose.model('Post', postSchema)
    console.log('mongoose models created')
}

export default models