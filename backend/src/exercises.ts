// First, let's establish our schema for these exercises:

// prisma/schema.prisma
datasource db {
    provider = "postgresql"
    url = env("DATABASE_URL")
}
  
  generator client {
    provider = "prisma-client-js"
}
  
  model User {
    id        String @id @default (uuid())
    email     String @unique
    name      String
    role      Role @default (USER)
    posts     Post[]
    profile   Profile ?
        comments  Comment[]
    likes     Like[]
    createdAt DateTime @default (now())
    updatedAt DateTime @updatedAt
}
  
  model Profile {
    id       String @id @default (uuid())
    bio      String ?
        avatar   String ?
            user     User @relation(fields: [userId], references: [id])
    userId   String @unique
    location String ?
  }
  
  model Post {
    id        String @id @default (uuid())
    title     String
    content   String
    published Boolean @default (false)
    author    User @relation(fields: [authorId], references: [id])
    authorId  String
    comments  Comment[]
    likes     Like[]
    tags      Tag[]
    createdAt DateTime @default (now())
    updatedAt DateTime @updatedAt
}
  
  model Comment {
    id        String @id @default (uuid())
    content   String
    post      Post @relation(fields: [postId], references: [id])
    postId    String
    author    User @relation(fields: [authorId], references: [id])
    authorId  String
    createdAt DateTime @default (now())
}
  
  model Like {
    id        String @id @default (uuid())
    post      Post @relation(fields: [postId], references: [id])
    postId    String
    user      User @relation(fields: [userId], references: [id])
    userId    String
    createdAt DateTime @default (now())

    @@unique([postId, userId])
}
  
  model Tag {
    id    String @id @default (uuid())
    name  String @unique
    posts Post[]
}

enum Role {
    USER
    ADMIN
}

// EXERCISE 1: Basic CRUD
// Create a new user with a profile
async function exercise1() {
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
            profile: {
                create: {
                    bio: 'Hello World'
                }
            }
        },
        include: {
            profile: true
        }
    });
    return user;
}

// EXERCISE 2: Nested Reads
// Get all posts with their authors, comments, and comment authors
async function exercise2() {
    const posts = await prisma.post.findMany({
        include: {
            author: true,
            comments: {
                include: {
                    author: true
                }
            }
        }
    });
    return posts;
}

// EXERCISE 3: Complex Filtering
// Find all published posts with more than 5 comments,
// ordered by comment count
async function exercise3() {
    const posts = await prisma.post.findMany({
        where: {
            published: true,
            comments: {
                some: {
                    id: {
                        not: undefined
                    }
                }
            }
        },
        include: {
            _count: {
                select: { comments: true }
            }
        },
        having: {
            comments: {
                _count: {
                    gt: 5
                }
            }
        },
        orderBy: {
            comments: {
                _count: 'desc'
            }
        }
    });
    return posts;
}

// EXERCISE 4: Transactions & Batch Operations
// Create a post with tags, and update user's post count in a transaction
async function exercise4(userId: string, postData: { title: string; content: string; tags: string[] }) {
    return await prisma.$transaction(async (tx) => {
        // Create tags if they don't exist
        const tags = await Promise.all(
            postData.tags.map(tagName =>
                tx.tag.upsert({
                    where: { name: tagName },
                    create: { name: tagName },
                    update: {}
                })
            )
        );

        // Create post with tags
        const post = await tx.post.create({
            data: {
                title: postData.title,
                content: postData.content,
                author: { connect: { id: userId } },
                tags: {
                    connect: tags.map(tag => ({ id: tag.id }))
                }
            }
        });

        return post;
    });
}

// EXERCISE 5: Advanced Aggregations
// Get user statistics including:
// - Total posts
// - Average comments per post
// - Most used tags
// - Engagement rate (likes/views ratio)
async function exercise5(userId: string) {
    const stats = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            _count: {
                select: { posts: true }
            },
            posts: {
                select: {
                    _count: {
                        select: {
                            comments: true,
                            likes: true
                        }
                    },
                    tags: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    // Calculate aggregations
    const totalPosts = stats._count.posts;
    const totalComments = stats.posts.reduce((sum, post) => sum + post._count.comments, 0);
    const avgCommentsPerPost = totalPosts > 0 ? totalComments / totalPosts : 0;

    // Count tag usage
    const tagCounts = stats.posts
        .flatMap(post => post.tags)
        .reduce((acc, tag) => {
            acc[tag.name] = (acc[tag.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    // Find most used tags
    const mostUsedTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return {
        totalPosts,
        avgCommentsPerPost,
        mostUsedTags
    };
}

// EXERCISE 6: Complex Search & Pagination
// Implement a paginated post search with multiple filters
type SearchParams = {
    query?: string;
    tags?: string[];
    authorId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
    orderBy?: 'likes' | 'comments' | 'date';
    orderDir?: 'asc' | 'desc';
};

async function exercise6(params: SearchParams) {
    const {
        query,
        tags,
        authorId,
        startDate,
        endDate,
        page = 1,
        pageSize = 10,
        orderBy = 'date',
        orderDir = 'desc'
    } = params;

    // Build where clause
    const where: any = {
        published: true,
        AND: []
    };

    if (query) {
        where.AND.push({
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } }
            ]
        });
    }

    if (tags?.length) {
        where.AND.push({
            tags: {
                some: {
                    name: {
                        in: tags
                    }
                }
            }
        });
    }

    if (authorId) {
        where.authorId = authorId;
    }

    if (startDate || endDate) {
        where.AND.push({
            createdAt: {
                ...(startDate && { gte: startDate }),
                ...(endDate && { lte: endDate })
            }
        });
    }

    // Build order by clause
    const orderByClause: any = {};
    switch (orderBy) {
        case 'likes':
            orderByClause.likes = { _count: orderDir };
            break;
        case 'comments':
            orderByClause.comments = { _count: orderDir };
            break;
        case 'date':
        default:
            orderByClause.createdAt = orderDir;
    }

    // Execute query
    const [posts, total] = await prisma.$transaction([
        prisma.post.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                tags: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            },
            orderBy: orderByClause,
            skip: (page - 1) * pageSize,
            take: pageSize
        }),
        prisma.post.count({ where })
    ]);

    return {
        posts,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
        }
    };
}

// EXERCISE 7: Recursive Relations & Graph Queries
// Add this to schema.prisma:
/*
model Category {
  id          String     @id @default(uuid())
  name        String
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  parentId    String?
  children    Category[] @relation("CategoryHierarchy")
  posts       Post[]
}
*/

// Get complete category tree with post counts
async function exercise7(rootCategoryId: string) {
    async function getTreeWithCounts(categoryId: string): Promise<any> {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                children: true,
                _count: {
                    select: { posts: true }
                }
            }
        });

        if (!category) return null;

        const children = await Promise.all(
            category.children.map(child => getTreeWithCounts(child.id))
        );

        return {
            ...category,
            postCount: category._count.posts,
            children
        };
    }

    return getTreeWithCounts(rootCategoryId);
}

// EXERCISE 8: Custom Queries & Raw SQL
// Get trending posts based on recent engagement
async function exercise8(timeWindow: { days: number } = { days: 7 }) {
    const result = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.title,
        COUNT(DISTINCT l.id) as like_count,
        COUNT(DISTINCT c.id) as comment_count,
        (COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id)) as engagement_score
      FROM "Post" p
      LEFT JOIN "Like" l ON l.post_id = p.id 
        AND l.created_at >= NOW() - INTERVAL '${timeWindow.days} days'
      LEFT JOIN "Comment" c ON c.post_id = p.id 
        AND c.created_at >= NOW() - INTERVAL '${timeWindow.days} days'
      WHERE p.published = true
      GROUP BY p.id, p.title
      HAVING (COUNT(DISTINCT l.id) + COUNT(DISTINCT c.id)) > 0
      ORDER BY engagement_score DESC
      LIMIT 10
    `;

    return result;
}