import mcData from './data.json'

const statusEmoji: Record<string, string> = {
  'live': '🟢',
  'in-progress': '🟡',
  'blocked': '🔴',
  'done': '✅',
  'ready': '⚪',
  'active': '🟢',
}

const statusLabel: Record<string, string> = {
  'live': 'LIVE',
  'in-progress': 'IN PROGRESS',
  'blocked': 'BLOCKED',
  'done': 'DONE',
  'ready': 'READY',
  'active': 'ACTIVE',
}

export default function MissionControl() {
  const data = mcData as typeof import('./data.json')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              🚀 Mission Control
            </h1>
            <p className="text-zinc-500 text-sm">Eðalkaup Operations Dashboard</p>
          </div>
          <div className="text-right text-xs text-zinc-600">
            <div>Last updated</div>
            <div className="text-zinc-400">{new Date(data.lastUpdated).toLocaleString('is-IS')}</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="On Site" value={data.inventory.onSite} color="text-green-400" />
          <StatCard label="In Progress" value={data.inventory.inProgress} color="text-yellow-400" />
          <StatCard label="Delivered" value={data.inventory.delivered} color="text-zinc-400" />
          <StatCard
            label="Photoroom Credits"
            value={`${data.tools.photoroom.credits}/${data.tools.photoroom.limit}`}
            color="text-blue-400"
          />
        </div>

        {/* Active Missions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-zinc-300">🎯 Active Missions</h2>
          <div className="space-y-3">
            {data.missions.map((m) => (
              <div key={m.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{m.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    {statusEmoji[m.status]} {statusLabel[m.status]}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 mb-3">{m.notes}</p>
                <div className="flex flex-wrap gap-2">
                  {m.steps.map((s, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded ${
                        s.done
                          ? 'bg-green-900/30 text-green-400 line-through'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {s.done ? '✓' : '○'} {s.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools & Agents */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tools */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-zinc-300">🔧 Tools</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
              {Object.values(data.tools).map((t) => (
                <div key={t.name} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    {'notes' in t && t.notes && (
                      <div className="text-xs text-zinc-500">{t.notes}</div>
                    )}
                    {'url' in t && t.url && (
                      <div className="text-xs text-zinc-500">{t.url}</div>
                    )}
                    {'repo' in t && t.repo && (
                      <div className="text-xs text-zinc-500">{t.repo}</div>
                    )}
                  </div>
                  <span className="text-xs">
                    {statusEmoji[t.status]} {statusLabel[t.status]}
                    {'credits' in t && (
                      <span className="ml-2 text-zinc-500">
                        {t.credits}/{t.limit}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Agents */}
          <section>
            <h2 className="text-lg font-semibold mb-4 text-zinc-300">🤖 Agent Team</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
              {data.agents.map((a) => (
                <div key={a.name} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{a.name}</div>
                    <div className="text-xs text-zinc-500">{a.role}</div>
                  </div>
                  <span className="text-xs">
                    {statusEmoji[a.status]} {statusLabel[a.status]}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-zinc-300">📝 Recent Activity</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg divide-y divide-zinc-800">
            {data.recentActivity.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span className="text-xs text-zinc-600 whitespace-nowrap mt-0.5">
                  {new Date(a.time).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-sm text-zinc-300">{a.action}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-600">
        Eðalkaup Mission Control — Powered by Kasper 🐾
      </footer>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  )
}
