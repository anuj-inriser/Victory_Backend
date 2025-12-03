const express = require('express');
const { getAllCommunityPosts, getCommunityPostById, updateCommunityPost, createCommunityPost, deleteCommunityPost } = require('../controllers/communityPosts.controller');
const router = express.Router();

router.get('/',getAllCommunityPosts)

router.get('/:id',getCommunityPostById)

router.post('/',createCommunityPost)

router.put('/:id',updateCommunityPost)

router.delete('/:id',deleteCommunityPost)

module.exports = router;