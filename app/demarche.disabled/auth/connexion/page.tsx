'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, Shield, Users, UserCheck, Building, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ConnexionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('citoyen')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organismeCode: '',
    agentId: ''
  })

  const handleDemoEmailClick = (email: string, type: string) => {
    setFormData(prev => ({ ...prev, email, password: 'Test123!' }))

    // Adapter l'onglet au type de compte
    if (email.includes('citoyen')) {
      setActiveTab('citoyen')
    } else if (email.includes('agent')) {
      setActiveTab('agent')
      setFormData(prev => ({ ...prev, organismeCode: 'DGDI' }))
    } else if (email.includes('admin@dgdi') || email.includes('admin@dgi') || email.includes('admin@cnss')) {
      setActiveTab('admin')
      setFormData(prev => ({ ...prev, organismeCode: email.includes('dgdi') ? 'DGDI' : email.includes('dgi') ? 'DGI' : 'CNSS' }))
    } else {
      setActiveTab('admin')
    }

    // Copier dans le presse-papiers
    navigator.clipboard.writeText(email).catch(() => {})
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      // Validation spécifique pour les agents
      if (activeTab === 'agent' && !formData.organismeCode) {
        throw new Error('Veuillez sélectionner votre organisme')
      }

      // Appel à l'API de connexion
      const response = await fetch('/api/demarche/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: activeTab,
          organismeCode: formData.organismeCode
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      // Stockage des informations utilisateur
      localStorage.setItem('demarche_user', JSON.stringify(data.user))
      localStorage.setItem('demarche_token', data.token)

      // Redirection selon le type d'utilisateur
      if (data.user.userRole === 'CITOYEN') {
        router.push('/demarche/citoyen/dashboard')
      } else if (data.user.userRole === 'AGENT') {
        router.push('/demarche/agent/dashboard')
      } else if (data.user.userRole === 'ADMIN') {
        router.push('/demarche/admin/dashboard')
      } else if (data.user.userRole === 'SUPER_ADMIN') {
        router.push('/super-admin/dashboard')
      }

    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const organismes = [
    { code: 'DGDI', nom: 'Direction Générale de la Documentation et de l\'Immigration' },
    { code: 'DGI', nom: 'Direction Générale des Impôts' },
    { code: 'CNSS', nom: 'Caisse Nationale de Sécurité Sociale' },
    { code: 'CNAMGS', nom: 'Caisse Nationale d\'Assurance Maladie' },
    { code: 'MAIRIE_LBV', nom: 'Mairie de Libreville' },
    { code: 'PREFECTURE_ES', nom: 'Préfecture de l\'Estuaire' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion à DEMARCHE.GA</h1>
          <p className="text-gray-600">Accédez à vos services administratifs en ligne</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-lg">Se connecter</CardTitle>
            <CardDescription className="text-center">
              Choisissez votre type de compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="citoyen" className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Citoyen</span>
                </TabsTrigger>
                <TabsTrigger value="agent" className="flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Agent</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mb-4 bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Connexion Citoyen */}
              <TabsContent value="citoyen" className="space-y-4">
                <div>
                  <Label htmlFor="email-citoyen">Adresse email</Label>
                  <Input
                    id="email-citoyen"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password-citoyen">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password-citoyen"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <Link href="/demarche/auth/mot-de-passe-oublie" className="text-sm text-blue-600 hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </TabsContent>

              {/* Connexion Agent */}
              <TabsContent value="agent" className="space-y-4">
                <div>
                  <Label htmlFor="organisme">Organisme</Label>
                  <Select value={formData.organismeCode} onValueChange={(value) => setFormData(prev => ({ ...prev, organismeCode: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionnez votre organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      {organismes.map((org) => (
                        <SelectItem key={org.code} value={org.code}>
                          {org.code} - {org.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email-agent">Email professionnel</Label>
                  <Input
                    id="email-agent"
                    type="email"
                    placeholder="prenom.nom@organisme.ga"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password-agent">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password-agent"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </TabsContent>

              {/* Connexion Admin */}
              <TabsContent value="admin" className="space-y-4">
                <div>
                  <Label htmlFor="email-admin">Email administrateur</Label>
                  <Input
                    id="email-admin"
                    type="email"
                    placeholder="admin@organisme.ga"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password-admin">Mot de passe</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password-admin"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </TabsContent>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </Tabs>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Vous n'avez pas de compte ?</p>
              <Link href="/demarche/auth/inscription" className="text-blue-600 hover:underline font-medium">
                Créer un compte citoyen
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="mb-4">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium">
                    🧪 Comptes de démonstration
                  </summary>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs space-y-2">
                    <div className="font-medium text-blue-900">Tous les mots de passe : <code className="bg-blue-100 px-1 rounded">Test123!</code></div>
                    <div className="space-y-1">
                      <div>
                        <strong>Citoyen :</strong>
                        <button
                          onClick={() => handleDemoEmailClick('citoyen1@exemple.com', 'citoyen')}
                          className="ml-1 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          citoyen1@exemple.com
                        </button>
                      </div>
                      <div>
                        <strong>Agent DGDI :</strong>
                        <button
                          onClick={() => handleDemoEmailClick('agent1@dgdi.ga', 'agent')}
                          className="ml-1 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          agent1@dgdi.ga
                        </button>
                      </div>
                      <div>
                        <strong>Admin DGDI :</strong>
                        <button
                          onClick={() => handleDemoEmailClick('admin@dgdi.ga', 'admin')}
                          className="ml-1 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          admin@dgdi.ga
                        </button>
                      </div>
                      <div>
                        <strong>Super Admin :</strong>
                        <button
                          onClick={() => handleDemoEmailClick('admin@demarche.ga', 'super_admin')}
                          className="ml-1 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          admin@demarche.ga
                        </button>
                      </div>
                    </div>
                    <div className="text-blue-700 mt-2">
                      💡 Cliquez sur un email pour le remplir automatiquement
                    </div>
                  </div>
                </details>
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>Connexion sécurisée - Données protégées</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/demarche" className="text-blue-600 hover:underline text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
