import { useEffect, useState } from 'react';

import { Post } from '@dddforum/shared/api/post';

import { Layout } from '../components/layout';
import { PostsList } from '../components/postsList';
import { PostsViewSwitcher } from '../components/postsViewSwitcher';
import { api } from '../api';

export const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const loadPosts = async () => {
    try {
      let response = await api.post.getPosts({ sort: 'recent' });
      setPosts(response.data!.posts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <Layout>
      <PostsViewSwitcher />
      <PostsList posts={posts} />
    </Layout>
  );
};
