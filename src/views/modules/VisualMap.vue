<template>
  <div class="min-h-screen relative">
    <!-- Header -->
    <header class="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <router-link
            to="/"
            class="flex items-center gap-3 group"
          >
            <span class="text-3xl">🗺️</span>
            <div>
              <h1 class="text-2xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Visual Map
              </h1>
              <p class="text-xs text-purple-200">Knowledge Graph • 3D Exploration</p>
            </div>
          </router-link>
          <router-link
            to="/"
            class="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors text-purple-200 hover:text-white"
          >
            ← Dashboard
          </router-link>
        </div>
      </div>
    </header>

    <!-- 3D Graph Container -->
    <div
      ref="graphContainer"
      class="w-full h-[calc(100vh-80px)]"
    ></div>

    <!-- Filter Controls -->
    <div class="fixed bottom-6 right-6 backdrop-blur-lg bg-black/60 border border-white/20 rounded-xl p-4 z-50">
      <h4 class="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">Filter Nodes</h4>
      <div class="space-y-2 text-sm">
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            v-model="filters.math"
            @change="updateGraph"
            class="w-4 h-4 rounded accent-gold-400"
          />
          <span class="w-3 h-3 rounded-full bg-gold-400"></span>
          <span class="text-purple-200 group-hover:text-white transition-colors">Mathematics</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            v-model="filters.alpha"
            @change="updateGraph"
            class="w-4 h-4 rounded accent-primary-400"
          />
          <span class="w-3 h-3 rounded-full bg-primary-400"></span>
          <span class="text-purple-200 group-hover:text-white transition-colors">Alphabet</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            v-model="filters.jewel"
            @change="updateGraph"
            class="w-4 h-4 rounded accent-green-400"
          />
          <span class="w-3 h-3 rounded-full bg-green-400"></span>
          <span class="text-purple-200 group-hover:text-white transition-colors">Jewels</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            v-model="filters.library"
            @change="updateGraph"
            class="w-4 h-4 rounded accent-blue-400"
          />
          <span class="w-3 h-3 rounded-full bg-blue-400"></span>
          <span class="text-purple-200 group-hover:text-white transition-colors">Library</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            v-model="filters.attribute"
            @change="updateGraph"
            class="w-4 h-4 rounded accent-orange-400"
          />
          <span class="w-3 h-3 rounded-full bg-orange-400"></span>
          <span class="text-purple-200 group-hover:text-white transition-colors">Attributes</span>
        </label>

        <!-- Divider -->
        <div class="border-t border-white/10 my-2 pt-2">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              v-model="filters.hideOrphans"
              @change="updateGraph"
              class="w-4 h-4 rounded accent-red-400"
            />
            <span class="w-3 h-3 rounded-full bg-red-400/50 border border-red-400"></span>
            <span class="text-purple-200 group-hover:text-white transition-colors">Hide Orphans</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Node Info Tooltip -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if=" hoveredNode "
        class="fixed bottom-6 left-6 backdrop-blur-lg bg-black/80 border border-white/20 rounded-xl p-4 z-50 max-w-xs"
      >
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">{{ getNodeEmoji( hoveredNode.type ) }}</span>
          <h4 class="text-lg font-bold text-white">{{ hoveredNode.name }}</h4>
        </div>
        <p class="text-sm text-purple-300">{{ hoveredNode.description || 'Click to explore' }}</p>
        <p class="text-xs text-purple-400 mt-2 italic">{{ getNodeTypeLabel( hoveredNode.type ) }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '../../stores/content'
import ForceGraph3D from '3d-force-graph'

const router = useRouter()
const contentStore = useContentStore()
const graphContainer = ref( null )
const hoveredNode = ref( null )
let graph = null

// Filter state - all enabled by default
const filters = ref( {
  math: true,
  alpha: true,
  jewel: true,
  library: true,
  attribute: true,
  hideOrphans: false
} )

// Node colors by type
const nodeColors = {
  math: '#FFD700',    // Gold
  alpha: '#8B5CF6',   // Primary purple
  jewel: '#10B981',   // Green
  library: '#3B82F6', // Blue
  attribute: '#F97316' // Orange
}

const getNodeEmoji = ( type ) => {
  const emojis = { math: '🔢', alpha: '🔤', jewel: '💎', library: '📚', attribute: '☀️' }
  return emojis[type] || '📍'
}

const getNodeTypeLabel = ( type ) => {
  const labels = { math: 'Supreme Mathematics', alpha: 'Supreme Alphabet', jewel: '12 Jewels', library: 'Knowledge Library', attribute: 'Divine Attribute' }
  return labels[type] || 'Unknown'
}

// Transform content stores into graph data
const buildGraphData = () => {
  const nodes = []
  const links = []

  // Add Mathematics nodes (if filter enabled)
  if ( filters.value.math ) {
    contentStore.mathematics.forEach( m => {
      nodes.push( {
        id: `math_${m.number}`,
        name: m.name,
        type: 'math',
        description: m.meaning,
        color: nodeColors.math
      } )
    } )
  }

  // Add Alphabet nodes (if filter enabled)
  if ( filters.value.alpha ) {
    contentStore.alphabet.forEach( a => {
      nodes.push( {
        id: `alpha_${a.letter}`,
        name: `${a.letter} - ${a.name}`,
        type: 'alpha',
        description: a.meaning,
        color: nodeColors.alpha
      } )
    } )
  }

  // Add Jewels nodes (if filter enabled)
  if ( filters.value.jewel ) {
    contentStore.jewels.forEach( j => {
      nodes.push( {
        id: `jewel_${j.id || j.name}`,
        name: j.name,
        type: 'jewel',
        description: j.description,
        color: nodeColors.jewel
      } )
    } )
  }

  // Add Library nodes (if filter enabled)
  if ( filters.value.library ) {
    contentStore.library.forEach( l => {
      nodes.push( {
        id: `lib_${l.id}`,
        name: l.title,
        type: 'library',
        description: l.summary || l.description,
        url: l.embedUrl || l.pdfUrl || l.link,
        color: nodeColors.library
      } )
    } )
  }

  // Generate links based on name correlations
  // Only create links when BOTH source and target node types are enabled

  // Math ↔ Alphabet (same name)
  if ( filters.value.math && filters.value.alpha ) {
    contentStore.mathematics.forEach( m => {
      contentStore.alphabet.forEach( a => {
        if ( a.name.toLowerCase().includes( m.name.toLowerCase() ) ||
          m.name.toLowerCase().includes( a.name.toLowerCase() ) ) {
          links.push( { source: `math_${m.number}`, target: `alpha_${a.letter}` } )
        }
      } )
    } )
  }

  // Math ↔ Jewels (same name)
  if ( filters.value.math && filters.value.jewel ) {
    contentStore.mathematics.forEach( m => {
      contentStore.jewels.forEach( j => {
        if ( j.name.toLowerCase() === m.name.toLowerCase() ) {
          links.push( { source: `math_${m.number}`, target: `jewel_${j.id || j.name}` } )
        }
      } )
    } )
  }

  // Alphabet ↔ Jewels (partial match)
  if ( filters.value.alpha && filters.value.jewel ) {
    contentStore.alphabet.forEach( a => {
      contentStore.jewels.forEach( j => {
        if ( j.name.toLowerCase().includes( a.name.toLowerCase() ) ||
          a.name.toLowerCase().includes( j.name.toLowerCase() ) ) {
          links.push( { source: `alpha_${a.letter}`, target: `jewel_${j.id || j.name}` } )
        }
      } )
    } )
  }

  // Library ↔ Mathematics (title/tags contain math name)
  if ( filters.value.library && filters.value.math ) {
    contentStore.library.forEach( lib => {
      const libText = `${lib.title} ${lib.tags?.join( ' ' ) || ''} ${lib.summary || ''}`.toLowerCase()
      contentStore.mathematics.forEach( m => {
        if ( libText.includes( m.name.toLowerCase() ) ) {
          links.push( { source: `lib_${lib.id}`, target: `math_${m.number}` } )
        }
      } )
    } )
  }

  // Library ↔ Alphabet (title/tags contain alphabet name)
  if ( filters.value.library && filters.value.alpha ) {
    contentStore.library.forEach( lib => {
      const libText = `${lib.title} ${lib.tags?.join( ' ' ) || ''} ${lib.summary || ''}`.toLowerCase()
      contentStore.alphabet.forEach( a => {
        if ( libText.includes( a.name.toLowerCase() ) ) {
          links.push( { source: `lib_${lib.id}`, target: `alpha_${a.letter}` } )
        }
      } )
    } )
  }

  // Library ↔ Jewels (title/tags contain jewel name)
  if ( filters.value.library && filters.value.jewel ) {
    contentStore.library.forEach( lib => {
      const libText = `${lib.title} ${lib.tags?.join( ' ' ) || ''} ${lib.summary || ''}`.toLowerCase()
      contentStore.jewels.forEach( j => {
        if ( libText.includes( j.name.toLowerCase() ) ) {
          links.push( { source: `lib_${lib.id}`, target: `jewel_${j.id || j.name}` } )
        }
      } )
    } )
  }

  // Parse relatedTo fields for explicit manual connections
  const allItems = [
    ...contentStore.mathematics.map( m => ( { ...m, nodeId: `math_${m.number}` } ) ),
    ...contentStore.alphabet.map( a => ( { ...a, nodeId: `alpha_${a.letter}` } ) ),
    ...contentStore.jewels.map( j => ( { ...j, nodeId: `jewel_${j.id || j.name}` } ) ),
    ...contentStore.library.map( l => ( { ...l, nodeId: `lib_${l.id}` } ) )
  ]

  allItems.forEach( item => {
    if ( item.relatedTo && Array.isArray( item.relatedTo ) ) {
      item.relatedTo.forEach( targetId => {
        // Check if BOTH source and target nodes exist in current filtered set
        const sourceExists = nodes.some( n => n.id === item.nodeId )
        const targetExists = nodes.some( n => n.id === targetId )
        if ( sourceExists && targetExists ) {
          links.push( { source: item.nodeId, target: targetId } )
        }
      } )
    }
  } )

  // Tag-based connections: items with shared tags get linked
  const tagMap = new Map() // tag -> [nodeIds]
  allItems.forEach( item => {
    if ( item.tags && Array.isArray( item.tags ) ) {
      item.tags.forEach( tag => {
        const normalizedTag = tag.toLowerCase()
        if ( !tagMap.has( normalizedTag ) ) {
          tagMap.set( normalizedTag, [] )
        }
        tagMap.get( normalizedTag ).push( item.nodeId )
      } )
    }
  } )

  // Create links between items sharing the same tag
  tagMap.forEach( ( nodeIds, tag ) => {
    if ( nodeIds.length > 1 ) {
      // Connect all items with this tag to each other (limit to avoid explosion)
      for ( let i = 0; i < Math.min( nodeIds.length, 5 ); i++ ) {
        for ( let j = i + 1; j < Math.min( nodeIds.length, 5 ); j++ ) {
          const sourceExists = nodes.some( n => n.id === nodeIds[i] )
          const targetExists = nodes.some( n => n.id === nodeIds[j] )
          if ( sourceExists && targetExists ) {
            links.push( { source: nodeIds[i], target: nodeIds[j] } )
          }
        }
      }
    }
  } )

  // Filter out orphan nodes (nodes with no links) if hideOrphans is enabled
  if ( filters.value.hideOrphans ) {
    const linkedNodeIds = new Set()
    links.forEach( link => {
      linkedNodeIds.add( typeof link.source === 'object' ? link.source.id : link.source )
      linkedNodeIds.add( typeof link.target === 'object' ? link.target.id : link.target )
    } )

    const filteredNodes = nodes.filter( node => linkedNodeIds.has( node.id ) )
    return { nodes: filteredNodes, links }
  }

  return { nodes, links }
}

const initGraph = () => {
  if ( !graphContainer.value ) return

  const { nodes, links } = buildGraphData()

  graph = ForceGraph3D()( graphContainer.value )
    .graphData( { nodes, links } )
    .nodeLabel( 'name' )
    .nodeColor( 'color' )
    .nodeRelSize( 6 )
    .linkColor( () => 'rgba(255,255,255,0.5)' )
    .linkWidth( 2 )
    .linkOpacity( 0.6 )
    .linkDirectionalParticles( 2 )
    .linkDirectionalParticleSpeed( 0.005 )
    .linkDirectionalParticleWidth( 2 )
    .backgroundColor( 'rgba(0,0,0,0)' )
    .onNodeHover( node => {
      hoveredNode.value = node
      graphContainer.value.style.cursor = node ? 'pointer' : 'grab'
    } )
    .onNodeClick( node => {
      if ( node.type === 'library' ) {
        // Navigate to Knowledge Library with item ID to open detail
        const libId = node.id.replace( 'lib_', '' )
        router.push( { path: '/knowledge-library', query: { open: libId } } )
      } else if ( node.type === 'math' ) {
        // Extract number from ID like "math_1"
        const num = node.id.replace( 'math_', '' )
        router.push( { path: '/supreme-mathematics', query: { open: num } } )
      } else if ( node.type === 'alpha' ) {
        // Extract letter from ID like "alpha_A"
        const letter = node.id.replace( 'alpha_', '' )
        router.push( { path: '/supreme-alphabet', query: { open: letter } } )
      } else if ( node.type === 'jewel' ) {
        router.push( '/12-jewels' )
      } else if ( node.type === 'attribute' ) {
        router.push( '/attribute-builder' )
      }
    } )
}

// Update graph when filters change
const updateGraph = () => {
  if ( graph ) {
    graph.graphData( buildGraphData() )
  }
}

onMounted( async () => {
  await contentStore.fetchAllContent()
  initGraph()
} )

onBeforeUnmount( () => {
  if ( graph ) {
    graph._destructor && graph._destructor()
  }
} )

// Rebuild graph when content changes
watch( () => contentStore.mathematics.length + contentStore.alphabet.length, () => {
  if ( graph && contentStore.mathematics.length > 0 ) {
    graph.graphData( buildGraphData() )
  }
} )
</script>

<style scoped>
/* Ensure the graph canvas fills the container */
:deep(canvas) {
  display: block;
}
</style>
