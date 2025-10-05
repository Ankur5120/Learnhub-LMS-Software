const mongoose = require('mongoose');
const Category = require('../models/category');
const Course = require('../models/course');
const User = require('../models/user');
const Profile = require('../models/profile');
const RatingAndReview = require('../models/ratingAndReview');

require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/learnhub');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Create a profile
        const profile = await Profile.create({
            gender: 'Male',
            dateOfBirth: '1990-01-01',
            about: 'Experienced instructor',
            contactNumber: 1234567890
        });
        console.log('Profile created:', profile._id);

        // Create a category
        const category = await Category.create({
            name: 'Web Development',
            description: 'Learn web development from basics to advanced'
        });
        console.log('Category created:', category._id);

        // Create a dummy instructor
        const instructor = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'instructor@example.com',
            password: 'password123', // hashed in real, but for seed
            accountType: 'Instructor',
            additionalDetails: profile._id,
            courses: [],
            image : ' https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-xnGLZJFli6FRyXSlm8-QnpJb9hh30HffEA&s',
            courseProgress: []
        });
        console.log('Instructor created:', instructor._id);

        // Create courses
        const courses = await Course.insertMany([
            {
                courseName: 'HTML & CSS Basics',
                courseDescription: 'Learn the fundamentals of HTML and CSS',
                instructor: instructor._id,
                whatYouWillLearn: 'HTML structure, CSS styling',
                price: 99,
                category: category._id,
                tag: ['HTML', 'CSS'],
                status: 'Published',
                instructions: ['Complete all modules', 'Practice regularly'],
                thumbnail :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROqTfgNIy7h2X0yDTKXEJawokbCkyiLTCxzw&s',
                sold: 150, // High enrollment
                ratingAndReviews: []
            },
            {
                courseName: 'JavaScript Fundamentals',
                courseDescription: 'Master JavaScript programming',
                instructor: instructor._id,
                whatYouWillLearn: 'Variables, functions, DOM manipulation',
                price: 149,
                category: category._id,
                tag: ['JavaScript'],
                status: 'Published',
                instructions: ['Watch videos', 'Do exercises'],
                thumbnail: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png',
                sold: 200, // Highest enrollment
                ratingAndReviews: []
            },
            {
                courseName: 'React for Beginners',
                courseDescription: 'Build dynamic web apps with React',
                instructor: instructor._id,
                whatYouWillLearn: 'Components, state, props',
                price: 199,
                category: category._id,
                tag: ['React', 'JavaScript'],
                status: 'Published',
                instructions: ['Follow tutorials', 'Build projects'],
                thumbnail: 'data:image/jpeg;base64,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',
                sold: 120, // Medium enrollment
                ratingAndReviews: []
            }
        ]);
        console.log('Courses created:', courses.map(c => c._id));

        // Create ratings for courses
        const ratings = [];
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            const numRatings = Math.floor(Math.random() * 10) + 5; // 5-15 ratings
            for (let j = 0; j < numRatings; j++) {
                const rating = await RatingAndReview.create({
                    user: instructor._id, // dummy user
                    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                    review: `Great course! Learned a lot. Rating: ${Math.floor(Math.random() * 2) + 4}`,
                    course: course._id
                });
                ratings.push(rating);
                course.ratingAndReviews.push(rating._id);
            }
            await course.save();
        }
        console.log('Ratings created:', ratings.length);

        // Update category with courses
        await Category.findByIdAndUpdate(category._id, {
            $push: { courses: { $each: courses.map(c => c._id) } }
        });

        console.log('Seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

connectDB().then(seedData);
