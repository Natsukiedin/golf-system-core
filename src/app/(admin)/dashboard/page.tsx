export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Mock Data Grids */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Metric {i + 1}</h3>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">+{Math.floor(Math.random() * 1000)}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">Recent Work Orders</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Order #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Iron shaft replacement</p>
                  </div>
                  <div className="ml-auto font-medium">In Progress</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
