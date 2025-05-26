# Create users first
insert User {
    name := 'alice',
};
insert User {
    name := 'bob',
};
# Insert chat histories for Alice
update User
filter .name = 'alice'
set {
    chats := {
        (insert Chat {
            messages := {
                (insert Message {
                    role := 'user',
                    body := 'What are the main differences between GPT-3 and GPT-4?',
                    timestamp := <datetime>'2024-01-07T10:00:00Z',
                    sources := {'arxiv:2303.08774', 'openai.com/research/gpt-4'}
                }),
                (insert Message {
                    role := 'assistant',
                    body := 'The key differences include improved reasoning capabilities, better context understanding, and enhanced safety features...',
                    timestamp := <datetime>'2024-01-07T10:00:05Z',
                    sources := {'openai.com/blog/gpt-4-details', 'arxiv:2303.08774'}
                })
            }
        }),
        (insert Chat {
            messages := {
                (insert Message {
                    role := 'user',
                    body := 'Can you explain what policy gradient methods are in RL?',
                    timestamp := <datetime>'2024-01-08T14:30:00Z',
                    sources := {'Sutton-Barto-RL-Book-Ch13', 'arxiv:1904.12901'}
                }),
                (insert Message {
                    role := 'assistant',
                    body := 'Policy gradient methods are a class of reinforcement learning algorithms that directly optimize the policy...',
                    timestamp := <datetime>'2024-01-08T14:30:10Z',
                    sources := {'Sutton-Barto-RL-Book-Ch13', 'spinning-up.openai.com'}
                })
            }
        })
    }
};
# Insert chat histories for Bob
update User
filter .name = 'bob'
set {
    chats := {
        (insert Chat {
            messages := {
                (insert Message {
                    role := 'user',
                    body := 'What are the pros and cons of different sharding strategies?',
                    timestamp := <datetime>'2024-01-05T16:15:00Z',
                    sources := {'martin-kleppmann-ddia-ch6', 'aws.amazon.com/sharding-patterns'}
                }),
                (insert Message {
                    role := 'assistant',
                    body := 'The main sharding strategies include range-based, hash-based, and directory-based sharding...',
                    timestamp := <datetime>'2024-01-05T16:15:08Z',
                    sources := {'martin-kleppmann-ddia-ch6', 'mongodb.com/docs/sharding'}
                }),
                (insert Message {
                    role := 'user',
                    body := 'Could you elaborate on hash-based sharding?',
                    timestamp := <datetime>'2024-01-05T16:16:00Z',
                    sources := {'mongodb.com/docs/sharding'}
                })
            }
        })
    }
};
