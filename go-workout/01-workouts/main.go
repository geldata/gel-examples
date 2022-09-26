package main

import (
	"github.com/edgedb/workout-tutorial/internal/workout"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/api/workout", workout.Create)
	r.GET("/api/workout", workout.ReadMany)
	r.GET("/api/workout/:id", workout.Read)

	r.Run()
}
