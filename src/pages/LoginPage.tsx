import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Mail, Lock, Eye, EyeOff, BarChart3, Link2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message || 'Invalid credentials')
      }
      // Do not navigate manually - App.tsx onAuthStateChange will setUser and
      // route guard `!user ? <LoginPage/> : <Navigate to="/dashboard"/>` will redirect automatically.
      // This prevents race condition where /dashboard loads before profile fetch completes.
    } catch {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 rounded-xl shadow-2xl overflow-hidden">
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-900">EnviroChain</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to EnviroChain</h1>
          <p className="mt-2 text-sm text-gray-500">Access your environmental monitoring dashboard.</p>
          {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label><div className="relative mt-1.5"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><Mail className="h-4 w-4 text-gray-400" /></div><input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" /></div></div>
            <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><div className="relative mt-1.5"><div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><Lock className="h-4 w-4 text-gray-400" /></div><input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition hover:text-gray-600">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            <div className="flex items-center justify-between"><label className="flex items-center gap-2"><input type="checkbox" checked readOnly className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" /><span className="text-sm text-gray-600">Remember me</span></label><button type="button" className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700">Forgot password?</button></div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50">{loading ? 'Signing in...' : 'Sign In'}</button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-500">Don't have an account? <Link to="/register" className="font-medium text-emerald-600 transition hover:text-emerald-700">Sign up</Link></p>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 p-16">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/10"><Leaf className="h-7 w-7 text-white" /></div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/10"><BarChart3 className="h-7 w-7 text-white" /></div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/10"><Link2 className="h-7 w-7 text-white" /></div>
          </div>
          <h2 className="text-2xl font-bold text-white">Environmental Intelligence Platform</h2>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100/80">Real-time IoT monitoring, blockchain verification, and AI-driven insights — all in one place.</p>
        </div>
      </div>
    </div>
  )
}
