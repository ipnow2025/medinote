"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MessageCircle, Search, Plus, TrendingUp, Clock, Users, Filter } from "lucide-react"
import { MainLayout } from "@/components/main-layout"

interface Post {
  id: number
  title: string
  content: string
  author: string
  avatar: string
  category: string
  likes: number
  comments: number
  timeAgo: string
  isLiked: boolean
  tags: string[]
  isVerified?: boolean
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "혈압 관리 꿀팁 공유합니다!",
    content:
      "10년간 고혈압을 관리하면서 터득한 노하우들을 공유해드려요. 매일 같은 시간에 측정하고, 염분 섭취를 줄이는 것이 가장 중요한 것 같아요.",
    author: "건강지킴이",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "고혈압",
    likes: 24,
    comments: 8,
    timeAgo: "2시간 전",
    isLiked: false,
    tags: ["혈압관리", "생활습관", "팁"],
    isVerified: true,
  },
  {
    id: 2,
    title: "복약 시간 잘 지키는 법?",
    content: "약 먹는 시간을 자꾸 까먹어서 고민이에요. 다들 어떻게 관리하시나요?",
    author: "새내기환자",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "복약관리",
    likes: 12,
    comments: 15,
    timeAgo: "4시간 전",
    isLiked: true,
    tags: ["복약", "알림", "질문"],
  },
  {
    id: 3,
    title: "당뇨 환자 운동 루틴 추천",
    content: "당뇨 진단받고 운동을 시작했는데, 혈당 관리에 도움이 되는 운동들을 소개해드릴게요.",
    author: "운동러버",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "당뇨",
    likes: 18,
    comments: 6,
    timeAgo: "6시간 전",
    isLiked: false,
    tags: ["당뇨", "운동", "혈당관리"],
  },
  {
    id: 4,
    title: "○○병원 내분비내과 후기",
    content: "처음 가본 병원인데 의사선생님이 정말 친절하시고 자세히 설명해주셨어요.",
    author: "리뷰왕",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "병원후기",
    likes: 9,
    comments: 3,
    timeAgo: "1일 전",
    isLiked: false,
    tags: ["병원후기", "내분비내과"],
  },
]

const categories = ["전체", "고혈압", "당뇨", "심장질환", "복약관리", "운동/식단", "병원후기", "기타"]

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [newPost, setNewPost] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewPostForm, setShowNewPostForm] = useState(false)

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleSubmitPost = () => {
    if (newTitle.trim() && newPost.trim()) {
      const post: Post = {
        id: posts.length + 1,
        title: newTitle,
        content: newPost,
        author: "나",
        avatar: "/placeholder.svg?height=40&width=40",
        category: "기타",
        likes: 0,
        comments: 0,
        timeAgo: "방금 전",
        isLiked: false,
        tags: [],
      }
      setPosts([post, ...posts])
      setNewPost("")
      setNewTitle("")
      setShowNewPostForm(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "전체" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const popularPosts = posts.filter((post) => post.likes > 15)
  const recentPosts = posts.slice(0, 3)

  const communityContent = (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">커뮤니티</h1>
        <p className="text-muted-foreground">만성질환 관리 경험과 정보를 나누어요</p>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="게시글 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            전체 게시글
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            인기 게시글
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            최신 게시글
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* 게시글 작성 */}
          <Card>
            <CardContent className="p-4">
              {!showNewPostForm ? (
                <Button
                  onClick={() => setShowNewPostForm(true)}
                  className="w-full justify-start text-muted-foreground bg-muted hover:bg-muted/80"
                  variant="ghost"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  질문이나 정보를 공유해보세요...
                </Button>
              ) : (
                <div className="space-y-4">
                  <Input
                    placeholder="제목을 입력하세요"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="내용을 입력하세요..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitPost}>게시글 등록</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewPostForm(false)
                        setNewPost("")
                        setNewTitle("")
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 게시글 목록 */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{post.author}</span>
                        {post.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            인증
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                            post.isLiked ? "text-red-500" : ""
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                          {post.likes}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </div>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          {popularPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.author}</span>
                      <Badge variant="secondary" className="text-xs">
                        🔥 인기
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 text-red-500">
                        <Heart className="h-4 w-4 fill-current" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {recentPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.author}</span>
                      <Badge variant="secondary" className="text-xs">
                        🆕 최신
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                          post.isLiked ? "text-red-500" : ""
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                        {post.likes}
                      </button>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )

  return <MainLayout>{communityContent}</MainLayout>
}
