
# coding: utf-8

# In[24]:

import networkx as nx
import sys


# In[25]:

T=nx.DiGraph()


# In[26]:

T.add_nodes_from(['users/search','users/show','trends/available','trends/place','statuses/user_timeline',
                  'statuses/home_timeline','statuses/lookup','geo/search','geo/reverse_geocode','geo/id/:place_id',
                 'friendships/show','friendships/lookup','friends/list','followers/list','favorites/list','search'])


# In[27]:

T.add_edges_from([
                ('users/search','users/show'),('users/search','statuses/user_timeline'),('users/search','friendships/show'),
                  ('users/search','friendships/lookup'),('users/search','friends/list'),('users/search','followers/list'),
                  ('users/search','favorites/list'),
                 ('users/show','users/profile_banner'),('users/show','statuses/user_timeline'),('users/show','friendships/lookup'),
                  ('users/show','friends/list'),('users/show','followers/list'),('users/show','favorites/list'),
                 ('trends/available','trends/place'),
                 ('statuses/user_timeline','statuses/lookup'),('statuses/user_timeline','friends/list'),('statuses/user_timeline','followers/list'),
                  ('statuses/user_timeline','favorites/list'),
                 ('statuses/home_timeline','statuses/lookup'),('statuses/user_homeline','friends/list'),('statuses/user_homeline','followers/list'),
                  ('statuses/home_timeline','favorites/list'),
                  ('statuses/lookup','users/show'),('statuses/lookup','statuses/user_timeline'),('statuses/lookup','friendships/show'),
                  ('statuses/lookup','friendships/lookup'),('statuses/lookup','friends/list'),('statuses/lookup','followers/list'),
                  ('statuses/lookup','favorites/list'),
                 ('geo/search','geo/id/:place_id'),
                 ('geo/reverse_geocode','geo/id/:place_id'),
                ('friends/list','users/show'),('friends/list','statuses/user_timeline'),('friends/list','friendships/show'),
                  ('friends/list','friendships/lookup'),('friends/list','friends/list'),('friends/list','followers/list'),
                  ('friends/list','favorites/list'),
                  ('followers/list','users/show'),('followers/list','statuses/user_timeline'),('followers/list','friendships/show'),
                  ('followers/list','friendships/lookup'),('followers/list','friends/list'),('followers/list','followers/list'),
                  ('followers/list','favorites/list'),
                  ('favorites/list','users/show'),('favorites/list','statuses/user_timeline'),('favorites/list','friendships/show'),
                  ('favorites/list','friendships/lookup'),('favorites/list','friends/list'),('favorites/list','followers/list'),
                  ('favorites/list','favorites/list'),('favorites/list','statuses/lookup'),
                  ('search','users/show'),('search','statuses/user_timeline'),('search','statuses/lookup'),
                  ('search','friendships/show'),('search','friendships/lookup'),('search','friends/list'),('search','followers/list'),
                  ('search','favorites/list')
                 ])


# In[38]:

if len(sys.argv)!=3:
    print('error, need 2 arguments')
else:
    start = sys.argv[1]
    end = sys.argv[2]
    
    for s_path in nx.all_shortest_paths(T,source=start,target=end):
        print('shortest path:',s_path)
        
    for path in nx.all_simple_paths(T, source=start, target=end):
        print('all path:', path)



