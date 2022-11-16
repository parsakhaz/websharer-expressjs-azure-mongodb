import mongoose from 'mongoose'

let models = {}

main()
async function main() {
    console.log('connecting to mongodb')
    await mongoose.connect('mongodb+srv://admin:password12345@cluster0.9hfnw7i.mongodb.net/websharer')

    console.log("successfully connected to mongodb!")

    // the below is data to include in posts to the mongodb database
    const postSchema = new mongoose.Schema({
        url: String,
        description: String,
        username: String,
        likes: [String],
        created_date: Date
    })
    models.Post = mongoose.model('Post', postSchema)

    const commentSchema = new mongoose.Schema({
        username: String,
        comment: String,
        post: String,
        created_date: Date
    })
    models.Comment = mongoose.model('Comment', commentSchema)

    console.log('mongoose models created')
}

export default models