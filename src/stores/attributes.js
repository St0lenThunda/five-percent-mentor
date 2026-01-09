import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../utils/api-client'
import { useUserStore } from './user'

export const useAttributesStore = defineStore( 'attributes', () => {
  const userStore = useUserStore()
  const attributeProgress = ref( {} ) // { attr_id: { level: 0, isBuilding: false } }
  const staticAttributes = ref( [] )
  const isLoading = ref( false )
  const lastGrowth = ref( null ) // For notification system

  const fetchAttributes = async () => {
    if ( !userStore.user?.id ) return
    isLoading.value = true
    try {
      // Load static data
      if ( staticAttributes.value.length === 0 ) {
        const response = await fetch( '/content-packs/attributes.json' )
        staticAttributes.value = await response.json()
      }

      // Load DB progress via API
      const progress = await api.getAttributes( userStore.user.id )

      const progressMap = {}
      progress.forEach( p => {
        progressMap[p.attributeId] = {
          level: p.level || 0,
          isBuilding: p.isBuilding || false
        }
      } )
      attributeProgress.value = progressMap
    } catch ( error ) {
      console.error( 'Failed to fetch attributes:', error )
    } finally {
      isLoading.value = false
    }
  }

  const setBuilding = async ( attributeId ) => {
    if ( !userStore.user?.id ) return
    try {
      // 1. Reset current building in local state
      const oldBuilding = Object.keys( attributeProgress.value ).find( id => attributeProgress.value[id].isBuilding )
      if ( oldBuilding ) {
        attributeProgress.value[oldBuilding].isBuilding = false
      }

      // 2. Set new building in local state
      if ( !attributeProgress.value[attributeId] ) {
        attributeProgress.value[attributeId] = { level: 0, isBuilding: true }
      } else {
        attributeProgress.value[attributeId].isBuilding = true
      }

      // Update via API
      await api.createOrUpdateAttribute( {
        userId: userStore.user.id,
        attributeId,
        isBuilding: true
      } )
    } catch ( error ) {
      console.error( 'Failed to set building attribute:', error )
    }
  }

  const growAttribute = async ( attributeId, amount = 1 ) => {
    if ( !userStore.user?.id ) return
    try {
      const current = attributeProgress.value[attributeId] || { level: 0, isBuilding: false }
      const newLevel = Math.min( (current.level || 0) + amount, 10 )
      
      if ( newLevel > current.level ) {
        attributeProgress.value[attributeId] = { ...current, level: newLevel }
        lastGrowth.value = {
          id: attributeId,
          name: staticAttributes.value.find( a => a.id === attributeId )?.name,
          level: newLevel 
        }

        // Log completion/growth via API
        await api.logAttributeCompletion( userStore.user.id, {
          attributeId,
          level: newLevel
        } )
      }
    } catch ( error ) {
      console.error( 'Failed to grow attribute:', error )
    }
  }

  const processTopicImpact = async ( topics ) => {
    if ( !topics || !Array.isArray( topics ) ) return
    
    // Check static attributes for growthTriggers overlap
    staticAttributes.value.forEach( attr => {
      const match = topics.some( t => attr.growthTriggers?.includes( t ) )
      if ( match ) {
        growAttribute( attr.id )
      }
    } )
  }

  return {
    attributeProgress,
    staticAttributes,
    isLoading,
    lastGrowth,
    fetchAttributes,
    setBuilding,
    growAttribute,
    processTopicImpact
  }
} )
