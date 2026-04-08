<template>
  <div class="min-h-screen bg-gray-100 p-4">

    <!-- HEADER -->
    <header class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-blue-600">SalonQueue</h1>

      <div class="flex gap-2">
        <button @click="role='client'" :class="role==='client' ? 'btn' : 'btn-secondary'">Client</button>
        <button @click="role='admin'" :class="role==='admin' ? 'btn' : 'btn-secondary'">Admin</button>
      </div>
    </header>

    <!-- ===== ADMIN PANEL ===== -->
    <div v-if="role==='admin'" class="card mb-4">
      <h2 class="font-bold mb-2">Yangi navbat qo‘shish</h2>

      <input v-model="adminForm.name" placeholder="Ism" class="input" />

      <select v-model="adminForm.service" class="input" multiple>
        <option disabled value="">Xizmat tanlang</option>
        <option v-for="s in services" :key="s.name" :value="s.name">
          {{ s.name }} ({{ s.duration }} min)
        </option>
      </select>

      <input type="date" v-model="adminForm.date" class="input" />

      <div class="grid grid-cols-3 gap-2 mb-3">
        <button
            v-for="t in availableSlots"
            :key="t"
            :disabled="isBookedRange(t, adminForm.date, getDuration(adminForm.service))"
            @click="adminForm.time = t"
            class="p-2 border rounded text-sm"
            :class="adminForm.time===t ? 'bg-blue-500 text-white' : ''"
        >
          {{ t }}
        </button>
      </div>

      <button @click="addByAdmin" class="btn w-full">Qo‘shish</button>
    </div>

    <!-- ===== CLIENT BOOKING ===== -->
    <div v-if="role==='client'" class="card mb-4">
      <h2 class="font-bold mb-2">Online navbat olish</h2>

      <input v-model="clientForm.name" placeholder="Ismingiz" class="input" />

      <select v-model="clientForm.service" class="input" multiple>
        <option disabled value="">Xizmat tanlang</option>
        <option v-for="s in services" :key="s.name" :value="s.name">
          {{ s.name }} ({{ s.duration }} min)
        </option>
      </select>

      <input type="date" v-model="clientForm.date" class="input" />

      <div class="grid grid-cols-3 gap-2 mb-3">
        <button
            v-for="t in availableSlots"
            :key="t"
            :disabled="isBookedRange(t, clientForm.date, getDuration(clientForm.service))"
            @click="clientForm.time = t"
            class="p-2 border rounded text-sm"
            :class="clientForm.time===t ? 'bg-green-500 text-white' : ''"
        >
          {{ t }}
        </button>
      </div>

      <button @click="addByClient" class="btn w-full">Navbat olish</button>
    </div>

    <!-- ===== QUEUE TABLE ===== -->
    <div class="card">
      <h2 class="font-bold mb-2">Navbatlar jadvali</h2>

      <table class="w-full text-sm">
        <thead>
        <tr class="text-left border-b">
          <th>Ism</th>
          <th>Xizmat</th>
          <th>Sana</th>
          <th>Vaqt</th>
          <th>Manba</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="q in queue"
            :key="q.id"
            class="border-b"
        >
          <td>{{ q.name }}</td>
          <td>{{ q.service }}</td>
          <td>{{ q.date }}</td>
          <td>{{ q.time }}</td>
          <td>
            <span
                :class="q.source==='admin' ? 'text-blue-500' : 'text-green-500'"
            >
              {{ q.source }}
            </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Service {
  name: string
  duration: number
}

interface QueueItem {
  id: number
  name: string
  service: string
  date: string
  time: string
  duration: number
  source: 'admin' | 'client'
}

const role = ref<'admin' | 'client'>('client')

const services: Service[] = [
  { name: 'Soch olish', duration: 30 },
  { name: 'Manikyur', duration: 60 },
  { name: 'Qosh olish', duration: 20 }
]

const queue = ref<QueueItem[]>([])

const clientForm = ref({ name: '', service: '', date: '', time: '' })
const adminForm = ref({ name: '', service: '', date: '', time: '' })

const baseSlots = () => {
  const arr: string[] = []
  for (let h = 9; h < 18; h++) {
    for (let m of [0, 20, 40]) {
      arr.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)
    }
  }
  return arr
}

const availableSlots = computed(() => baseSlots())

const getDuration = (service: string) => {
  return services.find(s => s.name === service)?.duration || 0
}

const addMinutes = (time: string, mins: number) => {
  const [h, m] = time.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m + mins)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

const isBookedRange = (time: string, date: string, duration: number) => {
  const end = addMinutes(time, duration)

  return queue.value.some(q => {
    if (q.date !== date) return false

    const qEnd = addMinutes(q.time, q.duration)

    return (
        (time >= q.time && time < qEnd) ||
        (end > q.time && end <= qEnd)
    )
  })
}

const addByClient = () => {
  const duration = getDuration(clientForm.value.service)

  queue.value.push({
    id: Date.now(),
    ...clientForm.value,
    duration,
    source: 'client'
  })

  clientForm.value = { name: '', service: '', date: '', time: '' }
}

const addByAdmin = () => {
  const duration = getDuration(adminForm.value.service)

  queue.value.push({
    id: Date.now(),
    ...adminForm.value,
    duration,
    source: 'admin'
  })

  adminForm.value = { name: '', service: '', date: '', time: '' }
}
</script>

<style>
.card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.input {
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.btn {
  background: #2563eb;
  color: white;
  padding: 10px;
  border-radius: 8px;
}

.btn-secondary {
  background: #e5e7eb;
  padding: 10px;
  border-radius: 8px;
}
</style>
