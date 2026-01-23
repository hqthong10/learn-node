# import
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

# Schema
const userSchema = new Schema({
    user_id: {
        required: true,
        type: Number,
        index: true
    },
    first_name: String,
    last_name: String,
    user_email: String,
    user_phone: String,
});

const postSchema = new Schema({
    post_id: {
        required: true,
        type: Number,
        index: true
    },
    title: String,
    content: String,
    categories: [String],
    author_id: Number,
    comments: [{
        comment_id: Number,
        comment_content: String
        comment_author: Number
    }],
    rating: [{
        rating_id: Number,
        rating_value: Number,
        rating_desc: String,
        rating_author: Number
    }],
    likes: [{
        like_id: Number,
        like_value: Boolean,
        like_author: Number
    }]
});
...
- methobs
- statics
- query helpers
- indexes
- virtuals
- aliases
- options

# Model
const User = model('Users', userSchema);
const Post = model('Posts', postSchema);

# Populate
- like in lookup, để join lấy data từ collection khác
    Post.find().populate('author_id')
    Post.find().populate({
        path: 'author_id',
        model: 'Users',
        match: { PN100: { $ge: '$FN100' } },
        select: 'PN100 NV106 NV107 NV108',
        foreignField: 'user_id'
    })
# Discriminators

# Execute
- insert
    + case 1:
        const user = new User({
            user_id: 1,
            first_name: 'huynh'
            last_name: 'thong',
            user_email: 'abcd@abc.com',
            user_phone: '0123456789'
        });
        user.save()

    + case 2:
        await User.create({
            user_id: 1,
            first_name: 'huynh'
            last_name: 'thong',
            user_email: 'abcd@abc.com',
            user_phone: '0123456789'
        });

    + case 3:
        await User.insertMany([{
            user_id: 1,
            first_name: 'huynh'
            last_name: 'thong',
            user_email: 'abcd@abc.com',
            user_phone: '0123456789'
        }])

- load list have paging
const list = await User.find().skip(offset).limit(limit);

- .find
- .findOne
- .deleteOne
- .deleteMany
- .updateOne

