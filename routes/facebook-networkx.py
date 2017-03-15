
# coding: utf-8

# In[9]:

import networkx as nx
import sys


# In[17]:

G=nx.DiGraph()


# In[18]:

G.add_nodes_from(['Album','Comment','Conversation','Event','Group','Live-Video','Page','Photo','Place',
                  'Place-Topic','Post','User','Video','Search'])


# In[21]:

G.add_edges_from([('Album','Photo'),('Album','Comment'),
                  ('Comment','Comment'),
                  ('Event','Comment'),('Event','Live-Video'),('Event','Photo'),('Event','Video'),('Event','Post'),
                  ('Group','Album'),('Group','Event'),('Group','Post'),('Group','Live-Video'),('Group','Photo'),('Group','Video'),
                  ('Live-Video','Comment'),
                  ('Page','Album'),('Page','Conversation'),('Page','Event'),('Page','Post'),('Page','Live-Video'),('Page','Photo'),('Page','Place-Topic'),('Page','Video'),
                  ('Photo','Comment'),
                  ('User','Album'),('User','Event'),('User','Photo'),('User','Video'),('User','Conversation'),('User','Post'),
                  ('Video','Comment'),
                  ('Search','User'),('Search','Page'),('Search','Event'),('Search','Group'),('Search','Place'),('Search','Place-Topic')])


# In[34]:

if len(sys.argv)!=3:
    print('error, need 2 arguments')
else:
    start = sys.argv[1]
    end = sys.argv[2]
    
    for s_path in nx.all_shortest_paths(G,source=start,target=end):
        print('shortest path:',s_path)
        
    for path in nx.all_simple_paths(G, source=start, target=end):
        print('all path:', path)

    




