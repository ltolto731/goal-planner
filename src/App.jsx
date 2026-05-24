import { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

function App() {
  // TASKS
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks")
    return saved
      ? JSON.parse(saved)
      : [
          {
            text: "Workout",
            status: "",
            category: "Fitness",
          },
          {
            text: "Study",
            status: "",
            category: "Study",
          },
        ]
  })

  // DARK MODE
  const [darkMode, setDarkMode] =
    useState(true)

  // INPUTS
  const [newTask, setNewTask] =
    useState("")

  const [category, setCategory] =
    useState("Study")

  // HISTORY
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("history")
    return saved
      ? JSON.parse(saved)
      : []
  })

  // STREAK
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("streak")
    return saved ? JSON.parse(saved) : 0
  })

  // XP
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem("xp")
    return saved ? JSON.parse(saved) : 0
  })

  // SAVE
  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    )

    localStorage.setItem(
      "history",
      JSON.stringify(history)
    )

    localStorage.setItem(
      "streak",
      JSON.stringify(streak)
    )

    localStorage.setItem(
      "xp",
      JSON.stringify(xp)
    )
  }, [tasks, history, streak, xp])

  // DONE COUNT
  const doneCount = tasks.filter(
    (t) => t.status === "done"
  ).length

  // PROGRESS
  const progress =
    tasks.length > 0
      ? Math.round(
          (doneCount / tasks.length) * 100
        )
      : 0

  // LEVEL
  const level =
    Math.floor(xp / 100) + 1

  // CHANGE STATUS
  const changeStatus = (index, status) => {
    const updated = [...tasks]

    updated[index].status = status

    setTasks(updated)
  }

  // ADD TASK
  const addTask = () => {
    if (!newTask) return

    setTasks([
      ...tasks,
      {
        text: newTask,
        status: "",
        category,
      },
    ])

    setNewTask("")
  }

  // DELETE
  const deleteTask = (index) => {
    const updated = [...tasks]

    updated.splice(index, 1)

    setTasks(updated)
  }

  // RENAME
  const renameTask = (index) => {
    const newName = prompt(
      "Rename Goal"
    )

    if (!newName) return

    const updated = [...tasks]

    updated[index].text = newName

    setTasks(updated)
  }

  // AUTO SAVE DAILY
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()

      if (
        now.getHours() === 0 &&
        now.getMinutes() === 0
      ) {
        const today =
          now.toLocaleDateString(
            "en-US",
            {
              weekday: "short",
              day: "numeric",
              month: "short",
            }
          )

        const alreadySaved =
          history.find(
            (item) =>
              item.day === today
          )

        if (!alreadySaved) {
          const updatedHistory = [
            ...history,
            {
              day: today,
              percent: progress,
            },
          ]

          setHistory(updatedHistory)

          // STREAK
          if (progress >= 70) {
            setStreak(streak + 1)
          } else {
            setStreak(0)
          }

          // XP
          setXp(xp + progress)

          // RESET
          const resetTasks =
            tasks.map((task) => ({
              ...task,
              status: "",
            }))

          setTasks(resetTasks)
        }
      }
    }, 60000)

    return () =>
      clearInterval(interval)
  }, [
    history,
    progress,
    streak,
    xp,
    tasks,
  ])

  // GRAPH
  const chartData = history.map((h) => ({
    day: h.day,
    value: h.percent,
  }))

  // PIE DATA
  const pieData = [
    {
      name: "Done",
      value: doneCount,
    },
    {
      name: "Left",
      value:
        tasks.length - doneCount,
    },
  ]

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ]

  // COLORS
  const bg = darkMode
    ? "#020617"
    : "#f1f5f9"

  const card = darkMode
    ? "#111827"
    : "white"

  const text = darkMode
    ? "white"
    : "black"

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        color: text,
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "45px",
            color: "#38bdf8",
          }}
        >
          Ultimate Life Dashboard
        </h1>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          style={{
            padding: "12px 18px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            background: "#38bdf8",
            fontWeight: "bold",
          }}
        >
          {darkMode
            ? "Light"
            : "Dark"}
        </button>
      </div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {/* PROGRESS */}
        <div
          style={{
            background: card,
            padding: "25px",
            borderRadius: "25px",
          }}
        >
          <h2>Progress</h2>

          <h1
            style={{
              color: "#38bdf8",
              fontSize: "50px",
            }}
          >
            {progress}%
          </h1>
        </div>

        {/* STREAK */}
        <div
          style={{
            background: card,
            padding: "25px",
            borderRadius: "25px",
          }}
        >
          <h2>Streak</h2>

          <h1
            style={{
              color: "#f97316",
              fontSize: "50px",
            }}
          >
            🔥 {streak}
          </h1>
        </div>

        {/* LEVEL */}
        <div
          style={{
            background: card,
            padding: "25px",
            borderRadius: "25px",
          }}
        >
          <h2>Level</h2>

          <h1
            style={{
              color: "#22c55e",
              fontSize: "50px",
            }}
          >
            {level}
          </h1>
        </div>

        {/* XP */}
        <div
          style={{
            background: card,
            padding: "25px",
            borderRadius: "25px",
          }}
        >
          <h2>Total XP</h2>

          <h1
            style={{
              color: "#e879f9",
              fontSize: "50px",
            }}
          >
            {xp}
          </h1>
        </div>
      </div>

      {/* GRAPH */}
      <div
        style={{
          background: card,
          padding: "25px",
          borderRadius: "25px",
          marginTop: "30px",
          height: "300px",
        }}
      >
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <XAxis
              dataKey="day"
              stroke="#888"
            />

            <YAxis stroke="#888" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              fill="#38bdf8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART */}
      <div
        style={{
          background: card,
          padding: "25px",
          borderRadius: "25px",
          marginTop: "30px",
          height: "350px",
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={120}
              label
            >
              {pieData.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index]
                    }
                  />
                )
              )}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ADD TASK */}
      <div
        style={{
          background: card,
          padding: "25px",
          borderRadius: "25px",
          marginTop: "30px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          value={newTask}
          onChange={(e) =>
            setNewTask(e.target.value)
          }
          placeholder="Add Goal..."
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "14px",
            border: "none",
            background: "#1e293b",
            color: "white",
          }}
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          style={{
            padding: "16px",
            borderRadius: "14px",
          }}
        >
          <option>Study</option>

          <option>Fitness</option>

          <option>Money</option>

          <option>Life</option>
        </select>

        <button
          onClick={addTask}
          style={{
            padding: "16px 24px",
            borderRadius: "14px",
            border: "none",
            background: "#38bdf8",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      {/* TASKS */}
      <div
        style={{
          marginTop: "30px",
        }}
      >
        {tasks.map((task, index) => (
          <div
            key={index}
            onContextMenu={(e) => {
              e.preventDefault()
              renameTask(index)
            }}
            style={{
              background: card,
              padding: "22px",
              borderRadius: "22px",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
              }}
            >
              <div>
                <h2>{task.text}</h2>

                <p
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  {task.category}
                </p>
              </div>

              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                Right Click Rename
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              {/* DONE */}
              <button
                onClick={() =>
                  changeStatus(
                    index,
                    "done"
                  )
                }
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background:
                    task.status ===
                    "done"
                      ? "#22c55e"
                      : "#1e293b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Done
              </button>

              {/* NOT DONE */}
              <button
                onClick={() =>
                  changeStatus(
                    index,
                    "not"
                  )
                }
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background:
                    task.status ===
                    "not"
                      ? "#ef4444"
                      : "#1e293b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Not Done
              </button>

              {/* DELETE */}
              <button
                onClick={() =>
                  deleteTask(index)
                }
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "#334155",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <div
        style={{
          background: card,
          padding: "25px",
          borderRadius: "25px",
          marginTop: "30px",
        }}
      >
        <h2
          style={{
            color: "#38bdf8",
          }}
        >
          History
        </h2>

        {history.map((item, index) => (
          <div
            key={index}
            style={{
              background:
                "rgba(255,255,255,0.05)",
              padding: "14px",
              borderRadius: "14px",
              marginTop: "10px",
              display: "flex",
              justifyContent:
                "space-between",
            }}
          >
            <span>{item.day}</span>

            <span>
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App