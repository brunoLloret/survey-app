// First, let's use this simplified schema:
/*
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  profile   Profile?
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
}

model Profile {
  id       String  @id @default(uuid())
  bio      String?
  website  String?
  user     User    @relation(fields: [userId], references: [id])
  userId   String  @unique
}

model Post {
  id        String    @id @default(uuid())
  title     String
  content   String
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
*/

// EXERCISE 1: Create with Nested Write & Selective Return
// Create a user with a profile and their first post
// Return only specific fields from the creation
// app.post('/user/:id', async (req, res) => {
//     try {
//         const newUser = await prisma.user.create({
//             data: {
//                 email: "email@example.com",
//                 name: "name",
//                 profile: {
//                     create: {
//                         bio: "bio"
//                     }
//                 },
//                 posts: {
//                     create: {
//                         title: "post1",
//                         content: "Hello world",
//                         published: true,
//                     }
//                 }
//             },
//             select: {
//                 id: true,
//                 email: true,
//                 profile: {
//                     select: {
//                         bio: true
//                     }
//                 },
//                 posts: {
//                     select: {
//                         title: true
//                     }
//                 }
//             }
//         });

//         // Send successful response
//         res.status(201).json(newUser);

//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(400).json({ 
//             error: 'Failed to create user',
//             details: error.message 
//         });
//     }
// });


// async function createUserWithProfileAndPost() {
//     try {
//         const newUser = await prisma.user.create({
//             data: {
//                 email: "new.user@example.com",
//                 name: "New User",
//                 profile: {
//                     create: {
//                         bio: "Hello, I'm new here!",
//                         website: "https://example.com"
//                     }
//                 },
//                 posts: {
//                     create: {
//                         title: "My First Post",
//                         content: "Hello World!",
//                         published: true
//                     }
//                 }
//             },
//             select: {
//                 id: true,
//                 email: true,
//                 profile: {
//                     select: {
//                         bio: true
//                     }
//                 },
//                 posts: {
//                     select: {
//                         title: true
//                     }
//                 }
//             }
//         });
//         return newUser;
//     } catch (error) {
//         console.error('Error:', error);
//         throw error;
//     }
// }

// EXERCISE 2: Find With Complex Nested Include
// Get all users who have published posts with comments
// Include their profiles and the comment authors
async function getUsersWithPublishedPostsAndComments() {
    try {
        const users = await prisma.user.findMany({
            where: {
                posts: {
                    some: {
                        published: true,
                        comments: {
                            some: {
                                id: {
                                    not: undefined
                                }
                            }
                        }
                    }
                }
            },
            include: {
                profile: true,
                posts: {
                    where: {
                        published: true
                    },
                    include: {
                        comments: {
                            include: {
                                author: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        return users;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// EXERCISE 3: Update with Relations
// Update a user's profile and create a new post in one operation
// Return the updated data in a specific format
async function updateUserProfileAndAddPost(userId: string) {
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profile: {
                    upsert: {
                        create: {
                            bio: "New bio",
                            website: "https://newwebsite.com"
                        },
                        update: {
                            bio: "Updated bio",
                            website: "https://updatedwebsite.com"
                        }
                    }
                },
                posts: {
                    create: {
                        title: "New Post During Update",
                        content: "This post was created during a profile update",
                        published: true
                    }
                }
            },
            select: {
                name: true,
                profile: {
                    select: {
                        bio: true,
                        website: true
                    }
                },
                posts: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    select: {
                        title: true,
                        content: true
                    }
                }
            }
        });
        return updatedUser;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// EXERCISE 4: Find with Nested Filtering and Counting
// Get users with their post count and recent comments
// Filter and order the results
async function getUsersWithPostStatsAndRecentComments() {
    try {
        const users = await prisma.user.findMany({
            where: {
                posts: {
                    some: {
                        published: true
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: {
                        posts: true,
                        comments: true
                    }
                },
                posts: {
                    where: {
                        published: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 3,
                    select: {
                        title: true,
                        comments: {
                            take: 5,
                            orderBy: {
                                id: 'desc'
                            },
                            select: {
                                content: true,
                                author: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                posts: {
                    _count: 'desc'
                }
            }
        });
        return users;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}