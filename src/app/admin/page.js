"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
  Label,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Dashboard() {
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      };
      try {
        const [activeUsersRes, registrationsRes, categoriesRes] =
          await Promise.all([
            fetch("/api/admin/stats/users/most-active", options),
            fetch("/api/admin/stats/users/registrations", options),
            fetch("/api/admin/stats/blogs/top-categories", options),
          ]);
        if (!activeUsersRes.ok || !registrationsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [activeUsers, registrations, categories] = await Promise.all([
          activeUsersRes.json(),
          registrationsRes.json(),
          categoriesRes.json(),
        ]);

        setActiveUsersData(activeUsers);
        setRegisteredUsers(registrations);
        setCategoriesData(categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  const activeUsersChartData = activeUsersData.map((user) => ({
    name: user.username,
    blogsCreated: user.blogsCreated,
  }));

  const registeredUsersChartData = registeredUsers.map((user) => ({
    month: user.month,
    count: user.count,
  }));

  const categoriesChartData = categoriesData.map((category) => ({
    _id: category._id,
    blogCount: category.blogCount,
  }));

  const colors = [
    "#ff8042",
    "#8884d8",
    "#FFBB28",
    "#00C49F",
    "#ffc658",
    "#82ca9d",
  ];

  return (
    <div className="my-24 md:mt-24 p-5 w-full flex flex-wrap gap-5">
      <Card className="flex-grow w-full xl:w-[60%]">
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>
            The number of users registered each month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={registeredUsersChartData}>
            <BarChart accessibilityLayer data={registeredUsers}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-desktop)" radius={8}>
                {registeredUsers.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="flex w-full xl:w-auto flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>
              The most popular categories based on the number of blogs created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoriesChartData}>
              <AreaChart accessibilityLayer data={categoriesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="_id"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="blogCount"
                  type="natural"
                  fill="#8884d8"
                  fillOpacity={0.4}
                  stroke="#8884d8"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
            <CardDescription>
              The users with the most blogs created.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={activeUsersChartData}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  formatter={(value, name) => `${name}: ${value}`}
                  content={<ChartTooltipContent />}
                />

                <Pie
                  data={activeUsersData}
                  dataKey="blogsCreated"
                  nameKey="username"
                  innerRadius={60}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {activeUsersData.length}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  {categoriesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
