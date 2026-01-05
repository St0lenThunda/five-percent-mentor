<template>
  <div class="p-4 rounded-xl bg-white/5 border border-white/10">
    <div class="flex items-center justify-between mb-4">
      <div class="flex flex-col">
        <span class="text-[10px] text-purple-400 font-semibold uppercase tracking-widest">{{ title }}</span>
        <h2 class="text-base font-bold text-white">{{ monthName }}</h2>
      </div>
      <div class="flex gap-1">
        <button
          @click="changeMonth( -1 )"
          class="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-purple-200 transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          @click="changeMonth( 1 )"
          class="p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-purple-200 transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-px text-center mb-1">
      <div
        v-for=" day in ['S', 'M', 'T', 'W', 'T', 'F', 'S'] "
        :key="day"
        class="text-[10px] text-purple-500 font-bold py-1"
      >
        {{ day }}
      </div>
      <div
        v-for=" ( day, index ) in calendarDays "
        :key="index"
        @click="day.date && selectDate( day.date )"
        class="aspect-square flex flex-col items-center justify-center rounded-md transition-all relative text-[11px]"
        :class="[
          day.date ? 'cursor-pointer hover:bg-white/10' : '',
          day.isToday ? 'bg-primary-500/20 text-primary-400 font-bold border border-primary-500/30' : '',
          selectedDate === day.date ? 'bg-gold-500/20 text-gold-400 font-bold border border-gold-500/50' : ''
        ]"
      >
        <span
          v-if=" day.day "
          :class="day.isToday || selectedDate === day.date ? '' : 'text-purple-300'"
        >
          {{ day.day }}
        </span>
        <span
          v-if=" day.hasActivity "
          class="absolute bottom-1 w-1 h-1 rounded-full bg-gold-500 shadow-[0_0_4px_rgba(255,215,0,0.6)]"
        ></span>
      </div>
    </div>

    <div
      v-if=" selectedDate "
      class="mt-2 text-center border-t border-white/5 pt-2"
    >
      <button
        @click="selectDate( null )"
        class="text-[10px] text-purple-400 hover:text-white underline transition-colors"
      >
        Clear filter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps( {
  title: {
    type: String,
    default: 'Activity'
  },
  activityDates: {
    type: Array,
    default: () => []
  },
  selectedDate: {
    type: String,
    default: null
  }
} )

const emit = defineEmits( ['update:selectedDate'] )

const currentMonth = ref( new Date() )

const monthName = computed( () => {
  return currentMonth.value.toLocaleDateString( 'en-US', { month: 'short', year: 'numeric' } )
} )

const changeMonth = ( delta ) => {
  const newDate = new Date( currentMonth.value )
  newDate.setMonth( newDate.getMonth() + delta )
  currentMonth.value = newDate
}

const calendarDays = computed( () => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const activitySet = new Set( props.activityDates )
  const todayStr = new Date().toISOString().split( 'T' )[0]

  const firstDay = new Date( year, month, 1 )
  const daysInMonth = new Date( year, month + 1, 0 ).getDate()
  const startDayOfWeek = firstDay.getDay()

  const days = []
  for ( let i = 0; i < startDayOfWeek; i++ ) {
    days.push( { day: null, date: null, hasActivity: false, isToday: false } )
  }
  for ( let d = 1; d <= daysInMonth; d++ ) {
    const dateStr = `${year}-${String( month + 1 ).padStart( 2, '0' )}-${String( d ).padStart( 2, '0' )}`
    days.push( { day: d, date: dateStr, hasActivity: activitySet.has( dateStr ), isToday: dateStr === todayStr } )
  }
  return days
} )

const selectDate = ( date ) => {
  emit( 'update:selectedDate', props.selectedDate === date ? null : date )
}
</script>
