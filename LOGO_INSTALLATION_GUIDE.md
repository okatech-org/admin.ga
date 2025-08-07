# 🎨 Guide d'Installation du Logo ADMINISTRATION.GA

## 📋 Vue d'ensemble

Ce guide explique comment ajouter le logo PNG officiel d'ADMINISTRATION.GA au projet et l'utiliser dans l'application.

## 🚀 Installation Rapide

### 1. Préparation du Logo

1. **Sauvegardez l'image** fournie sous le nom : `logo-administration-ga.png`
2. **Placez-la** dans le dossier : `public/images/`
3. **Vérifiez** l'installation avec : `node scripts/setup-logo.js`

### 2. Structure des fichiers

```
public/
└── images/
    ├── logo-administration-ga.png     # Logo principal
    ├── logo-administration-ga-small.png  # Version compacte (optionnel)
    └── README.md                      # Documentation
```

## 🔧 Composants Disponibles

### LogoPNG (Nouveau)
Logo PNG pur - recommandé pour la fidélité au design original

```tsx
import { LogoPNG } from '@/components/ui/logo-png';

// Usage basique
<LogoPNG width={32} height={32} />

// Avec className personnalisé
<LogoPNG 
  width={40} 
  height={40} 
  className="rounded-lg shadow-md" 
  alt="Logo officiel" 
/>
```

### LogoAdministrationGA (Amélioré)
Logo avec fallback automatique PNG → SVG

```tsx
import { LogoAdministrationGA } from '@/components/ui/logo-administration-ga';

// Utiliser le PNG si disponible
<LogoAdministrationGA usePNG={true} width={32} height={32} />

// Utiliser le SVG uniquement
<LogoAdministrationGA width={32} height={32} />
```

## 📖 Exemples d'Usage

### Header Principal
```tsx
// Dans authenticated-layout.tsx
<div className="flex items-center space-x-3">
  <LogoPNG width={32} height={32} />
  <div className="flex flex-col">
    <span className="font-bold text-base bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
      ADMINISTRATION.GA
    </span>
    <span className="text-xs text-muted-foreground">République Gabonaise</span>
  </div>
</div>
```

### Navigation Sidebar
```tsx
// Logo compact dans la sidebar
<LogoPNG width={24} height={24} className="flex-shrink-0" />
```

### Page d'accueil
```tsx
// Logo de grande taille
<LogoPNG width={64} height={64} className="mx-auto" />
```

## 🎯 Recommandations

### Qualité d'Image
- **Format :** PNG avec transparence
- **Résolution :** 512x512px minimum
- **Optimisation :** Compressée pour le web
- **Taille de fichier :** < 100KB idéalement

### Usage Contextuel
- **Header :** 32px x 32px
- **Sidebar :** 24px x 24px  
- **Mobile :** 28px x 28px
- **Landing page :** 64px x 64px
- **Favicon :** 16px x 16px

### Performance
- Utilisez `priority` pour les logos above-the-fold
- Considérez des variantes de taille pour différents contextes
- Le fallback SVG assure la compatibilité

## 🔄 Migration depuis SVG

Si vous utilisez actuellement le logo SVG :

```tsx
// Avant
<LogoAdministrationGA width={32} height={32} />

// Après (avec PNG)
<LogoPNG width={32} height={32} />
// OU
<LogoAdministrationGA usePNG={true} width={32} height={32} />
```

## 🛠 Outils et Scripts

### Script de Vérification
```bash
node scripts/setup-logo.js
```

### Exemples Interactifs
```tsx
import LogoUsageExamples from '@/components/examples/logo-usage-examples';
```

## 🎨 Variantes Possibles

### Créer des Variantes
```bash
# Logo compact (64x64)
# Logo haute résolution (1024x1024)
# Favicon (16x16, 32x32)
```

### Nommage Suggéré
```
logo-administration-ga.png       # Principal (512x512)
logo-administration-ga-small.png # Compact (64x64) 
logo-administration-ga-large.png # Haute-res (1024x1024)
favicon-16x16.png               # Favicon petit
favicon-32x32.png               # Favicon standard
```

## ✅ Checklist d'Installation

- [ ] Logo PNG placé dans `public/images/`
- [ ] Script de vérification exécuté avec succès
- [ ] Composants LogoPNG testés
- [ ] Header mis à jour avec le nouveau logo
- [ ] Fallback SVG fonctionnel
- [ ] Performance optimisée (lazy loading si nécessaire)

## 🔍 Dépannage

### Logo ne s'affiche pas
1. Vérifiez le chemin : `public/images/logo-administration-ga.png`
2. Vérifiez les permissions de fichier
3. Videz le cache du navigateur
4. Vérifiez la console pour les erreurs 404

### Qualité dégradée
1. Utilisez une résolution plus élevée
2. Optimisez sans perte de qualité
3. Vérifiez le format PNG

### Performance lente
1. Compressez l'image
2. Utilisez des tailles appropriées
3. Implémentez le lazy loading si nécessaire

---

*Le logo ADMINISTRATION.GA représente l'identité visuelle officielle de la République Gabonaise avec ses couleurs nationales et son design moderne.*
