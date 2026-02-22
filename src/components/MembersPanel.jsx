import { useEffect, useState } from "react";

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-rose-100 text-rose-600",
  "bg-yellow-100 text-yellow-600",
  "bg-cyan-100 text-cyan-600",
  "bg-pink-100 text-pink-600",
  "bg-indigo-100 text-indigo-600",
];

const clean = (str) => (str ?? "").trim();

// Module-level — never reset by StrictMode, persists across tab switches
let _cache = null;
let _promise = null; // deduplicate concurrent fetches

function fetchOnce() {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;

  _promise = fetch("/api/webhook-test/members")
    .then((res) => res.json())
    .then((raw) => {
      const data = Array.isArray(raw) ? raw.filter((m) => m.Name) : [];
      _cache = data;
      _promise = null;
      return data;
    });

  return _promise;
}

export default function MembersPanel() {
  const [members, setMembers] = useState(_cache ?? []);
  const [loading, setLoading] = useState(_cache === null);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    if (_cache) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMembers(_cache);
      setLoading(false);
      return;
    }

    fetchOnce()
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      clean(m.Name).toLowerCase().includes(q) ||
      clean(m.Position).toLowerCase().includes(q) ||
      clean(m.Domain).toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-32 gap-5">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Loading members…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-400 text-2xl">✕</div>
        <p className="text-sm font-semibold text-gray-700">Failed to load members</p>
        <p className="text-xs text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <p className="text-sm text-gray-400 mt-0.5">{members.length} people on this project</p>
        </div>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
        <input
          type="text"
          placeholder="Search by name, position or domain…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
          <span className="text-4xl">◉</span>
          <p className="text-sm">No members match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((member, idx) => (
            <MemberCard
              key={member.id ?? idx}
              member={member}
              colorClass={AVATAR_COLORS[idx % AVATAR_COLORS.length]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MemberCard({ member, colorClass }) {
  const name        = clean(member.Name);
  const position    = clean(member.Position);
  const domain      = clean(member.Domain);
  const description = clean(member.Description);
  const initials    = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const expLabel =
    member.Experience <= 2 ? { label: "Junior",   bg: "bg-blue-50 text-blue-600 border-blue-200"     } :
    member.Experience <= 5 ? { label: "Mid-level", bg: "bg-orange-50 text-orange-600 border-orange-200" } :
                             { label: "Senior",    bg: "bg-green-50 text-green-600 border-green-200"  };

  const tags = domain.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">

      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ${colorClass}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${expLabel.bg}`}>
              {expLabel.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{position}</p>
        </div>
      </div>

      <hr className="border-gray-100" />

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>

      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Experience</span>
          <span className="font-semibold text-gray-600">{member.Experience} yr{member.Experience !== 1 ? "s" : ""}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min((member.Experience / 10) * 100, 100)}%` }}
          />
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              +{tags.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}