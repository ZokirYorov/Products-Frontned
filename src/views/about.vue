<template>
  <div class="app">
    <div v-if="!role" class="role-screen">
      <div class="role-logo">
        <span class="role-logo-icon">✂️</span>
        <h1>SalonQueue</h1>
        <p>Kimligingizni tanlang</p>
      </div>
      <div class="role-cards">
        <button class="role-card role-card--staff" @click="enterAs('staff')">
          <span class="role-icon">👔</span>
          <h3>Xodim / Admin</h3>
          <p>Navbatlarni boshqarish, jadval, xodimlar</p>
        </button>
        <button class="role-card role-card--client" @click="enterAs('client')">
          <span class="role-icon">👤</span>
          <h3>Mijoz</h3>
          <p>Online navbat olish, bo'sh xodim tanlash</p>
        </button>
      </div>
    </div>
    <div v-else>
      <nav class="navbar">
        <div class="nav-inner">
          <div class="nav-logo" @click="resetView">✂️ <span>SalonQueue</span></div>
          <div class="nav-tabs">
            <button v-for="tab in (role==='staff'?staffTabs:clientTabs)" :key="tab.key"
                    class="nav-tab" :class="{'nav-tab--active':activeTab===tab.key}"
                    @click="activeTab=tab.key">{{ tab.label }}</button>
          </div>
          <div class="nav-right">
            <span class="role-pill" :class="role==='staff'?'rp--staff':'rp--client'">
              {{ role==='staff'?'👔 Xodim':'👤 Mijoz' }}
            </span>
            <button class="btn-exit" @click="role=null">Chiqish</button>
          </div>
        </div>
      </nav>

      <!-- STAFF -->
      <div v-if="role==='staff'" class="page">

        <!-- Schedule -->
        <div v-if="activeTab==='schedule'">
          <div class="page-header">
            <div>
              <h2 class="page-title">Kunlik jadval</h2>
              <p class="page-sub">Har bir xodimning band vaqtlari</p>
            </div>
            <div class="header-actions">
              <input type="date" v-model="scheduleDate" class="date-input" />
              <button class="btn-primary" @click="activeTab='add'">+ Navbat qo'shish</button>
            </div>
          </div>
          <div class="legend">
            <span class="legend-item"><span class="dot dot--online"></span> Online</span>
            <span class="legend-item"><span class="dot dot--manual"></span> Qo'lda</span>
            <span class="legend-item"><span class="dot dot--done"></span> Bajarildi</span>
            <span class="legend-item"><span class="dot dot--cancel"></span> Bekor</span>
          </div>
          <div class="sched-wrap">
            <div class="sched-table">
              <div class="sched-head">
                <div class="sched-time-hd">Vaqt</div>
                <div v-for="emp in employees" :key="emp.id" class="sched-emp-hd">
                  <span class="emp-avatar" :style="{background:emp.color}">{{ emp.name.charAt(0) }}</span>
                  <div>
                    <div class="emp-hd-name">{{ emp.name }}</div>
                    <div class="emp-hd-role">{{ emp.role }}</div>
                  </div>
                  <span class="emp-count">{{ bookingsForDateAndEmp(scheduleDate,emp.id).length }} ta</span>
                </div>
              </div>
              <div v-for="slot in timeSlots" :key="slot" class="sched-row">
                <div class="sched-time">{{ slot }}</div>
                <div v-for="emp in employees" :key="emp.id" class="sched-cell">
                  <div v-for="b in getCellBookings(slot,scheduleDate,emp.id)" :key="b.id"
                       class="sched-chip" :class="chipClass(b)" @click="detailBooking=b">
                    <span class="sc-source">{{ b.source==='online'?'🌐':'👔' }}</span>
                    <div class="sc-body">
                      <span class="sc-name">{{ b.clientName }}</span>
                      <span class="sc-svc">{{ b.service }}</span>
                    </div>
                    <span class="sc-end">→ {{ addMinutes(b.time,b.duration) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Employees -->
        <div v-if="activeTab==='employees'">
          <div class="page-header">
            <div><h2 class="page-title">Xodimlar</h2><p class="page-sub">Xodimlar va ish statistikasi</p></div>
            <button class="btn-primary" @click="showAddEmp=!showAddEmp">
              {{ showAddEmp?'Yopish':"+ Xodim qo'shish" }}
            </button>
          </div>
          <div v-if="showAddEmp" class="form-card" style="max-width:560px;margin-bottom:20px;">
            <h3 style="font-size:15px;font-weight:700;color:#1e293b;margin:0 0 16px">Yangi xodim</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Ism *</label>
                <input v-model="empForm.name" placeholder="Ism Familiya" />
              </div>
              <div class="form-group">
                <label>Lavozim *</label>
                <input v-model="empForm.role" placeholder="Sartarosh, Manikyurchi..." />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Telefon</label>
                <input v-model="empForm.phone" placeholder="+998 90 000 00 00" />
              </div>
              <div class="form-group">
                <label>Rang</label>
                <div class="color-picker">
                  <div v-for="c in empColors" :key="c" class="color-dot"
                       :class="{'color-dot--on':empForm.color===c}"
                       :style="{background:c}" @click="empForm.color=c"></div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Ixtisosligi</label>
              <div class="checkboxes">
                <label v-for="s in services" :key="s.name" class="cb-item">
                  <input type="checkbox" :value="s.name" v-model="empForm.services" />
                  {{ s.name }}
                </label>
              </div>
            </div>
            <div class="form-footer">
              <button class="btn-secondary" @click="showAddEmp=false">Bekor</button>
              <button class="btn-primary" @click="saveEmployee">Saqlash</button>
            </div>
          </div>
          <div class="emp-grid">
            <div v-for="emp in employees" :key="emp.id" class="emp-card">
              <div class="emp-card-top">
                <div class="emp-avatar-lg" :style="{background:emp.color}">{{ emp.name.charAt(0) }}</div>
                <div class="emp-card-info">
                  <h3 class="emp-card-name">{{ emp.name }}</h3>
                  <p class="emp-card-role">{{ emp.role }}</p>
                  <p class="emp-card-phone">{{ emp.phone||'—' }}</p>
                </div>
                <button v-if="employees.length>1" class="btn-del-sm" @click="deleteEmployee(emp.id)">✕</button>
              </div>
              <div class="emp-card-services">
                <span v-for="s in emp.services" :key="s" class="svc-tag">{{ s }}</span>
                <span v-if="!emp.services.length" class="svc-tag svc-tag--empty">Barchasi</span>
              </div>
              <div class="emp-card-stats">
                <div class="emp-stat">
                  <span class="emp-stat-val">{{ bookingsForEmp(emp.id,today).length }}</span>
                  <span class="emp-stat-lbl">Bugun</span>
                </div>
                <div class="emp-stat">
                  <span class="emp-stat-val">{{ totalBookingsForEmp(emp.id) }}</span>
                  <span class="emp-stat-lbl">Jami</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- All bookings -->
        <div v-if="activeTab==='bookings'">
          <div class="page-header">
            <div><h2 class="page-title">Barcha navbatlar</h2></div>
            <div class="header-actions">
              <select v-model="filterEmp" class="filter-select">
                <option value="">Barcha xodim</option>
                <option v-for="e in employees" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
              <select v-model="filterSource" class="filter-select">
                <option value="">Barcha tur</option>
                <option value="online">Online</option>
                <option value="staff">Qo'lda</option>
              </select>
              <select v-model="filterStatus" class="filter-select">
                <option value="">Barcha holat</option>
                <option value="Kutilmoqda">Kutilmoqda</option>
                <option value="Bajarildi">Bajarildi</option>
                <option value="Bekor">Bekor</option>
              </select>
            </div>
          </div>
          <div class="bookings-table">
            <div class="table-head">
              <span>Mijoz</span>
              <span>Xizmat</span>
              <span>Xodim</span>
              <span>Sana / Vaqt</span>
              <span>Tur</span>
              <span>Holat</span>
              <span></span>
            </div>
            <div v-if="filteredAllBookings.length===0" class="table-empty">Navbat topilmadi</div>
            <div v-for="b in filteredAllBookings" :key="b.id" class="table-row"
                 :class="b.source==='online'?'row--online':'row--manual'">
              <span class="td td-name">{{ b.clientName }}<small class="td-phone">{{ b.phone }}</small></span>
              <span class="td td-svc">{{ b.service }}</span>
              <span class="td td-emp">
                <span class="emp-mini" :style="{background:getEmp(b.employeeId)?.color||'#94a3b8'}">
                  {{ getEmp(b.employeeId)?.name.charAt(0)||'?' }}
                </span>
                {{ getEmp(b.employeeId)?.name||'—' }}
              </span>
              <span class="td td-date">{{ formatDateShort(b.date) }}<br/><strong>{{ b.time }} — {{ addMinutes(b.time,b.duration) }}</strong></span>
              <span class="td">
                <span class="src-badge" :class="b.source==='online'?'src--online':'src--manual'">
                  {{ b.source==='online'?'🌐 Online':"👔 Qo'lda" }}
                </span>
              </span>
              <span class="td">
                <select :value="b.status"
                        @change="updateStatus(b.id,($event.target as HTMLSelectElement).value)"
                        class="status-sel" :class="statusClass(b.status)">
                  <option>Kutilmoqda</option><option>Bajarildi</option><option>Bekor</option>
                </select>
              </span>
              <span class="td"><button class="btn-del" @click="deleteBooking(b.id)">🗑</button></span>
            </div>
          </div>
        </div>

        <!-- Add booking -->
        <div v-if="activeTab==='add'">
          <div class="page-header">
            <div><h2 class="page-title">Navbat qo'shish</h2><p class="page-sub">Mijoz uchun qo'lda navbat</p></div>
          </div>
          <div class="form-card">
            <div class="form-row">
              <div class="form-group">
                <label>Mijoz ismi *</label>
                <input v-model="addForm.clientName" placeholder="Aziz Karimov" :class="{'inp-err':addErrors.clientName}" />
                <span class="err-msg" v-if="addErrors.clientName">{{ addErrors.clientName }}</span>
              </div>
              <div class="form-group">
                <label>Telefon</label>
                <input v-model="addForm.phone" placeholder="+998 90 000 00 00" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Xizmat turi *</label>
                <select v-model="addForm.service" @change="onAddServiceChange" :class="{'inp-err':addErrors.service}">
                  <option value="">Tanlang...</option>
                  <option v-for="s in services" :key="s.name" :value="s.name">{{ s.name }} ({{ s.duration }} min)</option>
                </select>
                <span class="err-msg" v-if="addErrors.service">{{ addErrors.service }}</span>
              </div>
              <div class="form-group">
                <label>Sana *</label>
                <input type="date" v-model="addForm.date" :min="today"
                       @change="addForm.employeeId=0;addForm.time=''"
                       :class="{'inp-err':addErrors.date}" />
                <span class="err-msg" v-if="addErrors.date">{{ addErrors.date }}</span>
              </div>
            </div>
            <div class="form-group" v-if="addForm.service&&addForm.date">
              <label>Xodim tanlang *</label>
              <div class="emp-picker">
                <div v-for="emp in employeesForService(addForm.service)" :key="emp.id"
                     class="emp-pick-card"
                     :class="{'ep--selected':addForm.employeeId===emp.id,'ep--full':isEmpFull(emp.id,addForm.date,addForm.service)}"
                     @click="selectEmp(emp,addForm)">
                  <div class="ep-avatar" :style="{background:emp.color}">{{ emp.name.charAt(0) }}</div>
                  <div class="ep-info">
                    <span class="ep-name">{{ emp.name }}</span>
                    <span class="ep-role">{{ emp.role }}</span>
                  </div>
                  <div class="ep-slots">
                    <span class="ep-free" :class="freeSlots(emp.id,addForm.date,addForm.service)===0?'ep-free--none':''">
                      {{ freeSlots(emp.id,addForm.date,addForm.service)===0?'To\'liq band':freeSlots(emp.id,addForm.date,addForm.service)+' ta bo\'sh' }}
                    </span>
                    <span class="ep-busy">{{ busyCount(emp.id,addForm.date) }} band</span>
                  </div>
                </div>
              </div>
              <span class="err-msg" v-if="addErrors.employeeId">{{ addErrors.employeeId }}</span>
            </div>
            <div class="form-group" v-if="addForm.employeeId">
              <label>Vaqt tanlang *</label>
              <div class="slots-grid">
                <button v-for="t in timeSlots" :key="t" class="slot-btn"
                        :class="{'slot--sel':addForm.time===t,'slot--busy':isSlotBusy(t,addForm.date,addForm.service,addForm.employeeId,null),'slot--free':!isSlotBusy(t,addForm.date,addForm.service,addForm.employeeId,null)}"
                        :disabled="isSlotBusy(t,addForm.date,addForm.service,addForm.employeeId,null)"
                        @click="addForm.time=t">{{ t }}</button>
              </div>
              <span class="err-msg" v-if="addErrors.time">{{ addErrors.time }}</span>
            </div>
            <div class="form-group">
              <label>Izoh</label>
              <textarea v-model="addForm.note" rows="2" placeholder="Qo'shimcha..."></textarea>
            </div>
            <div class="form-footer">
              <button class="btn-secondary" @click="activeTab='schedule'">Bekor</button>
              <button class="btn-primary" @click="saveStaffBooking">Saqlash</button>
            </div>
          </div>
        </div>
      </div>

      <!-- CLIENT -->
      <div v-if="role==='client'" class="page">

        <!-- Book -->
        <div v-if="activeTab==='book'">
          <div class="page-header">
            <div><h2 class="page-title">Navbat olish</h2><p class="page-sub">Xizmat, usta va vaqtni tanlang</p></div>
          </div>
          <div class="form-card">
            <div class="form-row">
              <div class="form-group">
                <label>Ismingiz *</label>
                <input v-model="clientForm.clientName" placeholder="Ism Familiya" :class="{'inp-err':clientErrors.clientName}" />
                <span class="err-msg" v-if="clientErrors.clientName">{{ clientErrors.clientName }}</span>
              </div>
              <div class="form-group">
                <label>Telefon *</label>
                <input v-model="clientForm.phone" placeholder="+998 90 000 00 00" :class="{'inp-err':clientErrors.phone}" />
                <span class="err-msg" v-if="clientErrors.phone">{{ clientErrors.phone }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Xizmat turi *</label>
                <select v-model="clientForm.service" @change="onClientServiceChange" :class="{'inp-err':clientErrors.service}">
                  <option value="">Tanlang...</option>
                  <option v-for="s in services" :key="s.name" :value="s.name">
                    {{ s.name }} — {{ s.price?.toLocaleString() }} so'm ({{ s.duration }} min)
                  </option>
                </select>
                <span class="err-msg" v-if="clientErrors.service">{{ clientErrors.service }}</span>
              </div>
              <div class="form-group">
                <label>Sana *</label>
                <input type="date" v-model="clientForm.date" :min="today"
                       @change="clientForm.employeeId=0;clientForm.time=''"
                       :class="{'inp-err':clientErrors.date}" />
                <span class="err-msg" v-if="clientErrors.date">{{ clientErrors.date }}</span>
              </div>
            </div>
            <div class="form-group" v-if="clientForm.service&&clientForm.date">
              <label>Usta tanlang *</label>
              <p class="form-hint">Bo'sh ustalari ko'ring va tanlang</p>
              <div class="emp-picker">
                <div v-for="emp in employeesForService(clientForm.service)" :key="emp.id"
                     class="emp-pick-card"
                     :class="{'ep--selected':clientForm.employeeId===emp.id,'ep--full':isEmpFull(emp.id,clientForm.date,clientForm.service)}"
                     @click="selectEmp(emp,clientForm)">
                  <div class="ep-avatar" :style="{background:emp.color}">{{ emp.name.charAt(0) }}</div>
                  <div class="ep-info">
                    <span class="ep-name">{{ emp.name }}</span>
                    <span class="ep-role">{{ emp.role }}</span>
                  </div>
                  <div class="ep-slots">
                    <span class="ep-free" :class="freeSlots(emp.id,clientForm.date,clientForm.service)===0?'ep-free--none':''">
                      {{ freeSlots(emp.id,clientForm.date,clientForm.service)===0?'To\'liq band':freeSlots(emp.id,clientForm.date,clientForm.service)+' ta bo\'sh' }}
                    </span>
                  </div>
                </div>
              </div>
              <span class="err-msg" v-if="clientErrors.employeeId">{{ clientErrors.employeeId }}</span>
            </div>
            <div v-if="clientForm.employeeId&&clientForm.date&&clientForm.service" class="busy-bar">
              <span class="busy-lbl">{{ getEmp(clientForm.employeeId)?.name }} — {{ formatDateShort(clientForm.date) }}</span>
              <div class="busy-dots">
                <div v-for="t in timeSlots" :key="t" class="busy-dot"
                     :class="isSlotBusy(t,clientForm.date,clientForm.service,clientForm.employeeId,null)?'bd--red':'bd--green'"
                     :title="t"></div>
              </div>
              <span class="busy-hint">
                <span class="busy-dot bd--green"></span> Bo'sh &nbsp;
                <span class="busy-dot bd--red"></span> Band
              </span>
            </div>
            <div class="form-group" v-if="clientForm.employeeId">
              <label>Vaqt tanlang *</label>
              <div class="slots-grid">
                <button v-for="t in timeSlots" :key="t" class="slot-btn"
                        :class="{'slot--sel':clientForm.time===t,'slot--busy':isSlotBusy(t,clientForm.date,clientForm.service,clientForm.employeeId,null),'slot--free':!isSlotBusy(t,clientForm.date,clientForm.service,clientForm.employeeId,null)}"
                        :disabled="isSlotBusy(t,clientForm.date,clientForm.service,clientForm.employeeId,null)"
                        @click="clientForm.time=t">{{ t }}</button>
              </div>
              <span class="err-msg" v-if="clientErrors.time">{{ clientErrors.time }}</span>
            </div>
            <div v-if="clientForm.service&&clientForm.employeeId&&clientForm.time" class="booking-summary">
              <h4 class="summary-title">Navbat tafsilotlari</h4>
              <div class="summary-row"><span>Xizmat</span><strong>{{ clientForm.service }}</strong></div>
              <div class="summary-row"><span>Usta</span><strong>{{ getEmp(clientForm.employeeId)?.name }}</strong></div>
              <div class="summary-row"><span>Vaqt</span><strong>{{ clientForm.time }} — {{ addMinutes(clientForm.time,selectedClientSvc?.duration||0) }}</strong></div>
              <div class="summary-row"><span>Narx</span><strong>{{ selectedClientSvc?.price?.toLocaleString() }} so'm</strong></div>
            </div>
            <div class="form-footer">
              <button class="btn-primary btn-wide" @click="saveClientBooking">Navbat olish →</button>
            </div>
          </div>
          <div v-if="successMsg" class="toast-success">✅ {{ successMsg }}</div>
        </div>

        <!-- My bookings -->
        <div v-if="activeTab==='mybookings'">
          <div class="page-header">
            <div><h2 class="page-title">Mening navbatlarim</h2><p class="page-sub">Telefon raqamingiz bilan qidiring</p></div>
          </div>
          <div class="search-row">
            <input v-model="myPhone" placeholder="Telefon raqam kiriting..." class="search-inp" />
          </div>
          <div v-if="myPhone.length>=5">
            <div v-if="myBookings.length===0" class="empty-msg">Bu raqam bilan navbat topilmadi</div>
            <div v-else class="my-list">
              <div v-for="b in myBookings" :key="b.id" class="my-card">
                <div class="my-left">
                  <div class="my-icon">{{ serviceIcon(b.service) }}</div>
                  <div>
                    <h4 class="my-svc">{{ b.service }}</h4>
                    <p class="my-meta">{{ formatDateShort(b.date) }} · {{ b.time }} — {{ addMinutes(b.time,b.duration) }}</p>
                    <p class="my-emp">
                      <span class="emp-mini" :style="{background:getEmp(b.employeeId)?.color||'#94a3b8'}">
                        {{ getEmp(b.employeeId)?.name.charAt(0)||'?' }}
                      </span>
                      {{ getEmp(b.employeeId)?.name||'—' }}
                    </p>
                  </div>
                </div>
                <div class="my-right">
                  <span class="src-badge" :class="b.source==='online'?'src--online':'src--manual'">
                    {{ b.source==='online'?'🌐 Online':"👔 Qo'lda" }}
                  </span>
                  <span class="status-badge" :class="statusClass(b.status)">{{ b.status }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="client-sched">
            <h3 class="section-title">Bugungi jadval — bo'sh vaqtlar</h3>
            <div class="cs-scroll">
              <div class="cs-grid">
                <div class="cs-head-time">Vaqt</div>
                <div v-for="emp in employees" :key="emp.id" class="cs-head-emp">
                  <span class="emp-mini" :style="{background:emp.color}">{{ emp.name.charAt(0) }}</span>
                  {{ emp.name }}
                </div>
              </div>
              <div v-for="slot in timeSlots" :key="slot" class="cs-row">
                <div class="cs-time">{{ slot }}</div>
                <div v-for="emp in employees" :key="emp.id" class="cs-cell">
                  <template v-if="getCellBookings(slot,today,emp.id).length">
                    <span v-for="b in getCellBookings(slot,today,emp.id)" :key="b.id"
                          class="cs-chip" :class="b.source==='online'?'cs--online':'cs--manual'">
                      {{ b.service }}
                    </span>
                  </template>
                  <span v-else class="cs-free">Bo'sh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="detailBooking" class="overlay" @click.self="detailBooking=null">
      <div class="modal">
        <div class="modal-head">
          <h3>Navbat tafsilotlari</h3>
          <button class="modal-close" @click="detailBooking=null">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-row"><span>Mijoz</span><strong>{{ detailBooking.clientName }}</strong></div>
          <div class="modal-row"><span>Telefon</span><strong>{{ detailBooking.phone||'—' }}</strong></div>
          <div class="modal-row"><span>Xizmat</span><strong>{{ detailBooking.service }}</strong></div>
          <div class="modal-row"><span>Xodim</span><strong>{{ getEmp(detailBooking.employeeId)?.name||'—' }}</strong></div>
          <div class="modal-row"><span>Vaqt</span><strong>{{ detailBooking.date }} · {{ detailBooking.time }} — {{ addMinutes(detailBooking.time,detailBooking.duration) }}</strong></div>
          <div class="modal-row">
            <span>Tur</span>
            <span class="src-badge" :class="detailBooking.source==='online'?'src--online':'src--manual'">
              {{ detailBooking.source==='online'?'🌐 Online':"👔 Qo'lda" }}
            </span>
          </div>
          <div class="modal-row" v-if="detailBooking.note"><span>Izoh</span><strong>{{ detailBooking.note }}</strong></div>
        </div>
        <div class="modal-footer">
          <select :value="detailBooking.status"
                  @change="updateStatus(detailBooking.id,($event.target as HTMLSelectElement).value)"
                  class="status-sel" :class="statusClass(detailBooking.status)">
            <option>Kutilmoqda</option><option>Bajarildi</option><option>Bekor</option>
          </select>
          <button class="btn-del-md" @click="deleteBooking(detailBooking.id);detailBooking=null">O'chirish</button>
          <button class="btn-primary" @click="detailBooking=null">Yopish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, Ref} from 'vue'

interface Service { name:string; duration:number; price?:number }
interface Employee { id:number; name:string; role:string; phone:string; color:string; services:string[] }
interface Booking {
  id:number;
  clientName:string;
  phone:string;
  service:string;
  duration:number
  date:string;
  time:string;
  status:'Kutilmoqda'|'Bajarildi'|'Bekor'
  source:'online'|'staff';
  employeeId:number;
  note?:string
}
interface BookingForm { clientName:string; phone:string; service:string; duration:number; date:string; time:string; employeeId:number; note?:string }

const role       = ref<'staff'|'client'|null>(null)
const activeTab  = ref('schedule')
const staffTabs  = [
    {key:'schedule', label:'📅 Jadval'},
    {key:'employees', label:'👥 Xodimlar'},
    {key:'bookings', label:'📋 Navbatlar'},
    {key:'add', label:"+ Qo'shish"}
]
const clientTabs = [{key:'book',label:'📅 Navbat olish'},{key:'mybookings',label:'🕐 Mening navbatlarim'}]
const today      = new Date().toISOString().split('T')[0]
const scheduleDate = ref(today)
const filterEmp    = ref<number|''>('')
const filterSource = ref('')
const filterStatus = ref('')
const myPhone      = ref('')
const successMsg   = ref('')
const showAddEmp   = ref(false)
const detailBooking = ref<Booking|null>(null)
const empColors = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444']

const services = ref<Service[]>([
  {name:'Soch olish',duration:30,price:50000},
  {name:'Manikyur',duration:60,price:80000},
  {name:'Qosh olish',duration:20,price:30000},
  {name:"Soch bo'yash",duration:90,price:150000},
  {name:'Yuz parvarishi',duration:60,price:100000},
  {name:'Soqol olish',duration:20,price:25000},
])

const employees = ref<Employee[]>([
  {id:1,name:'Jasur',role:'Sartarosh',phone:'+998901111111',color:'#6366f1',services:['Soch olish','Soqol olish']},
  {id:2,name:'Nodira',role:'Manikyurchi',phone:'+998902222222',color:'#ec4899',services:['Manikyur','Qosh olish']},
  {id:3,name:'Sherzod',role:'Sartarosh',phone:'+998903333333',color:'#0ea5e9',services:['Soch olish',"Soch bo'yash",'Soqol olish']},
  {id:4,name:'Laylo',role:'Kosmetolog',phone:'+998904444444',color:'#10b981',services:['Yuz parvarishi','Qosh olish',"Soch bo'yash"]},
])

const empForm = ref({name:'',role:'',phone:'',color:'#6366f1',services:[] as string[]})

const bookings = ref<Booking[]>([
  {id:1,clientName:'Aziz Karimov',phone:'+998901234567',service:'Soch olish',duration:30,date:today,time:'09:00',status:'Kutilmoqda',source:'online',employeeId:1},
  {id:2,clientName:'Malika Rahimova',phone:'+998932345678',service:'Manikyur',duration:60,date:today,time:'09:00',status:'Kutilmoqda',source:'staff',employeeId:2},
  {id:3,clientName:'Jamshid Toshev',phone:'+998933456789',service:'Soqol olish',duration:20,date:today,time:'10:00',status:'Bajarildi',source:'online',employeeId:3},
  {id:4,clientName:'Sarvinoz',phone:'+998935678901',service:'Qosh olish',duration:20,date:today,time:'10:30',status:'Kutilmoqda',source:'online',employeeId:4},
  {id:5,clientName:'Bobur',phone:'+998936789012',service:"Soch bo'yash",duration:90,date:today,time:'11:00',status:'Kutilmoqda',source:'staff',employeeId:3},
])

const emptyAdd    = ():BookingForm => ({clientName:'',phone:'',service:'',duration:0,date:today,time:'',employeeId:0,note:''})
const emptyClient = ():BookingForm => ({clientName:'',phone:'',service:'',duration:0,date:today,time:'',employeeId:0})

interface FormErrors {
  clientName?: string
  phone?: string
  service?: string
  date?: string
  employeeId?: string
  time?: string
}

const addForm    = ref<BookingForm>(emptyAdd())
const clientForm = ref<BookingForm>(emptyClient())
const addErrors    = ref<FormErrors>({})
const clientErrors = ref<FormErrors>({})

const filteredAllBookings = computed(()=>
    bookings.value
        .filter(b=>!filterEmp.value||b.employeeId===filterEmp.value)
        .filter(b=>!filterSource.value||b.source===filterSource.value)
        .filter(b=>!filterStatus.value||b.status===filterStatus.value)
        .sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))
)
const myBookings = computed(()=>
    bookings.value.filter(b=>b.phone.replace(/\s/g,'').includes(myPhone.value.replace(/\s/g,'')))
)
const selectedClientSvc = computed(()=>services.value.find(s=>s.name===clientForm.value.service))

const timeSlots:string[] = (()=>{
  const s:string[]=[]
  for(let h=9;h<19;h++)
    for(const m of[0,30])
      s.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)
  return s
})()

function toMins(t:string):number{ const[h,m]=t.split(':').map(Number); return h*60+m }
function addMinutes(time:string,mins:number):string{
  const[h,m]=time.split(':').map(Number)
  const d=new Date(2000,0,1,h,m+mins)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
function isSlotBusy(slot:string,date:string,svcName:string,empId:number,excludeId:number|null):boolean{
  if(!date||!empId) return false
  const svc=services.value.find(s=>s.name===svcName)
  const dur=svc?.duration||30
  const start=toMins(slot),end=start+dur
  return bookings.value.some(b=>{
    if(b.date!==date||b.employeeId!==empId) return false
    if(excludeId!==null&&b.id===excludeId) return false
    const bs=toMins(b.time),be=bs+b.duration
    return start<be&&end>bs
  })
}
function getCellBookings(slot:string,date:string,empId:number):Booking[]{
  return bookings.value.filter(b=>b.date===date&&b.employeeId===empId&&b.time===slot)
}
function bookingsForDateAndEmp(date:string,empId:number){ return bookings.value.filter(b=>b.date===date&&b.employeeId===empId) }
function bookingsForEmp(empId:number,date:string){ return bookings.value.filter(b=>b.employeeId===empId&&b.date===date) }
function totalBookingsForEmp(empId:number){ return bookings.value.filter(b=>b.employeeId===empId).length }
function freeSlots(empId:number,date:string,svcName:string){ return timeSlots.filter(t=>!isSlotBusy(t,date,svcName,empId,null)).length }
function busyCount(empId:number,date:string){ return bookings.value.filter(b=>b.date===date&&b.employeeId===empId).length }
function isEmpFull(empId:number,date:string,svcName:string){ return freeSlots(empId,date,svcName)===0 }
function getEmp(id:number){ return employees.value.find(e=>e.id===id) }
function employeesForService(svcName:string){ return employees.value.filter(e=>!e.services.length||e.services.includes(svcName)) }
function formatDateShort(d:string){ if(!d) return ''; return new Date(d).toLocaleDateString('uz-UZ',{day:'2-digit',month:'short'}) }
function chipClass(b:Booking){ if(b.status==='Bekor') return 'chip--cancel'; if(b.status==='Bajarildi') return 'chip--done'; return b.source==='online'?'chip--online':'chip--manual' }
function statusClass(s:string){ if(s==='Bajarildi') return 'st--done'; if(s==='Bekor') return 'st--cancel'; return 'st--pending' }
function serviceIcon(name:string){ if(name.includes('Soch')) return '✂️'; if(name.includes('Manikyur')) return '💅'; if(name.includes('Qosh')) return '✨'; if(name.includes("bo'yash")) return '🎨'; if(name.includes('Yuz')) return '🌸'; if(name.includes('Soqol')) return '🪒'; return '💈' }

function enterAs(r:'staff'|'client'){ role.value=r; activeTab.value=r==='staff'?'schedule':'book' }
function resetView(){ activeTab.value=role.value==='staff'?'schedule':'book' }
function selectEmp(emp: Employee, form: Ref<BookingForm>) {
  if (isEmpFull(emp.id, form.value.date, form.value.service)) return
  form.value.employeeId = emp.id
  form.value.time = ''
}
function onAddServiceChange(){ const s=services.value.find(x=>x.name===addForm.value.service); addForm.value.duration=s?.duration||0; addForm.value.employeeId=0; addForm.value.time='' }
function onClientServiceChange(){ const s=services.value.find(x=>x.name===clientForm.value.service); clientForm.value.duration=s?.duration||0; clientForm.value.employeeId=0; clientForm.value.time='' }

function validateAdd(){
  addErrors.value={};
  if(!addForm.value.clientName.trim())
    addErrors.value.clientName='Ism majburiy';
  if(!addForm.value.service)
    addErrors.value.service='Xizmat tanlang';
  if(!addForm.value.date)
    addErrors.value.date='Sana tanlang';
  if(!addForm.value.employeeId)
    addErrors.value.employeeId='Xodim tanlang';
  if(!addForm.value.time)
    addErrors.value.time='Vaqt tanlang';
  return !Object.keys(addErrors.value).length
}
function validateClient(){ clientErrors.value={}; if(!clientForm.value.clientName.trim()) clientErrors.value.clientName='Ism majburiy'; if(!clientForm.value.phone.trim()) clientErrors.value.phone='Telefon majburiy'; if(!clientForm.value.service) clientErrors.value.service='Xizmat tanlang'; if(!clientForm.value.date) clientErrors.value.date='Sana tanlang'; if(!clientForm.value.employeeId) clientErrors.value.employeeId='Usta tanlang'; if(!clientForm.value.time) clientErrors.value.time='Vaqt tanlang'; return !Object.keys(clientErrors.value).length }

function saveStaffBooking(){
  if(!validateAdd()) return;
  bookings.value.push({id:Date.now(),
    clientName:addForm.value.clientName,
    phone:addForm.value.phone,
    service:addForm.value.service,
    duration:addForm.value.duration,
    date:addForm.value.date,
    time:addForm.value.time,
    status:'Kutilmoqda',
    source:'staff',
    employeeId:addForm.value.employeeId,
    note:addForm.value.note
  });
  scheduleDate.value=addForm.value.date;
  addForm.value=emptyAdd();
  activeTab.value='schedule'
}
function saveClientBooking(){ if(!validateClient()) return; bookings.value.push({id:Date.now(),clientName:clientForm.value.clientName,phone:clientForm.value.phone,service:clientForm.value.service,duration:clientForm.value.duration,date:clientForm.value.date,time:clientForm.value.time,status:'Kutilmoqda',source:'online',employeeId:clientForm.value.employeeId}); const emp=getEmp(clientForm.value.employeeId); successMsg.value=`${emp?.name} ustasi bilan ${formatDateShort(clientForm.value.date)} soat ${clientForm.value.time} da navbatiz qabul qilindi!`; myPhone.value=clientForm.value.phone; clientForm.value=emptyClient(); setTimeout(()=>{successMsg.value=''},6000); activeTab.value='mybookings' }
function deleteBooking(id:number){ bookings.value=bookings.value.filter(b=>b.id!==id) }
function updateStatus(id:number,status:string){ const b=bookings.value.find(b=>b.id===id); if(b) b.status=status as Booking['status']; if(detailBooking.value?.id===id) detailBooking.value={...detailBooking.value!,status:status as Booking['status']} }
function saveEmployee(){ if(!empForm.value.name.trim()||!empForm.value.role.trim()) return; employees.value.push({id:Date.now(),name:empForm.value.name,role:empForm.value.role,phone:empForm.value.phone,color:empForm.value.color,services:[...empForm.value.services]}); empForm.value={name:'',role:'',phone:'',color:'#6366f1',services:[]}; showAddEmp.value=false }
function deleteEmployee(id:number){ employees.value=employees.value.filter(e=>e.id!==id) }
</script>

<style scoped>
*{box-sizing:border-box}
.app{min-height:100vh;background:#f0f2f5;font-family:'Segoe UI',system-ui,sans-serif}
.role-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:40px}
.role-logo{text-align:center}.role-logo-icon{font-size:52px;display:block;margin-bottom:10px}
.role-logo h1{font-size:34px;font-weight:800;color:#1e293b;margin:0 0 6px}
.role-logo p{font-size:16px;color:#64748b;margin:0}
.role-cards{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
.role-card{width:240px;padding:28px 24px;border-radius:16px;border:2px solid transparent;background:#fff;cursor:pointer;text-align:left;transition:all .2s}
.role-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.1)}
.role-card--staff{border-left:4px solid #6366f1}.role-card--staff:hover{border-color:#6366f1}
.role-card--client{border-left:4px solid #0ea5e9}.role-card--client:hover{border-color:#0ea5e9}
.role-icon{font-size:36px;display:block;margin-bottom:12px}
.role-card h3{font-size:17px;font-weight:700;color:#1e293b;margin:0 0 8px}
.role-card p{font-size:13px;color:#64748b;margin:0;line-height:1.5}
.navbar{background:#1e293b;position:sticky;top:0;z-index:20}
.nav-inner{max-width:1400px;margin:0 auto;padding:0 20px;height:60px;display:flex;align-items:center;gap:16px}
.nav-logo{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:800;color:#fff;cursor:pointer;flex-shrink:0}
.nav-tabs{display:flex;gap:4px;flex:1;overflow-x:auto}
.nav-tab{padding:7px 14px;border-radius:8px;border:none;background:transparent;color:#94a3b8;font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap}
.nav-tab:hover{background:rgba(255,255,255,.08);color:#fff}
.nav-tab--active{background:rgba(255,255,255,.15);color:#fff}
.nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
.role-pill{font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px}
.rp--staff{background:#4f46e5;color:#fff}.rp--client{background:#0284c7;color:#fff}
.btn-exit{font-size:12px;padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#94a3b8;cursor:pointer}
.btn-exit:hover{color:#fff;border-color:rgba(255,255,255,.4)}
.page{max-width:1400px;margin:0 auto;padding:24px 20px}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:16px}
.page-title{font-size:22px;font-weight:700;color:#1e293b;margin:0 0 4px}
.page-sub{font-size:13px;color:#64748b;margin:0}
.header-actions{display:flex;gap:10px;align-items:center;flex-shrink:0;flex-wrap:wrap}
.btn-primary{padding:10px 20px;border:none;border-radius:10px;background:#4f46e5;color:#fff;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s}
.btn-primary:hover{background:#4338ca}
.btn-primary.btn-wide{width:100%;padding:14px;font-size:15px}
.btn-secondary{padding:10px 20px;border:1px solid #d1d5db;border-radius:10px;background:#fff;color:#374151;font-size:14px;font-weight:500;cursor:pointer}
.btn-secondary:hover{background:#f9fafb}
.btn-del{background:none;border:none;cursor:pointer;font-size:16px;color:#ef4444;opacity:.7}
.btn-del:hover{opacity:1}
.btn-del-sm{background:none;border:none;cursor:pointer;font-size:14px;color:#ef4444;opacity:.6;padding:4px}
.btn-del-md{padding:10px 16px;border:1px solid #fca5a5;background:#fef2f2;color:#dc2626;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer}
.legend{display:flex;gap:16px;margin-bottom:16px;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:6px;font-size:13px;color:#64748b}
.dot{width:10px;height:10px;border-radius:50%;display:inline-block}
.dot--online{background:#0ea5e9}.dot--manual{background:#6366f1}.dot--done{background:#22c55e}.dot--cancel{background:#94a3b8}
.sched-wrap{overflow-x:auto;border-radius:14px;border:1px solid #e2e8f0;background:#fff}
.sched-table{min-width:700px}
.sched-head{display:flex;border-bottom:2px solid #e2e8f0;background:#f8fafc;position:sticky;top:60px;z-index:5}
.sched-time-hd{width:70px;flex-shrink:0;padding:12px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;border-right:1px solid #e2e8f0}
.sched-emp-hd{flex:1;padding:10px 12px;border-right:1px solid #e2e8f0;display:flex;align-items:center;gap:8px;min-width:160px}
.emp-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}
.emp-hd-name{font-size:13px;font-weight:700;color:#1e293b;line-height:1.2}
.emp-hd-role{font-size:11px;color:#94a3b8}
.emp-count{margin-left:auto;font-size:11px;background:#e2e8f0;color:#64748b;padding:2px 8px;border-radius:20px;flex-shrink:0}
.sched-row{display:flex;border-bottom:1px solid #f1f5f9;min-height:48px}
.sched-row:hover{background:#fafbff}
.sched-time{width:70px;flex-shrink:0;padding:8px 12px;font-size:12px;font-weight:700;color:#94a3b8;border-right:1px solid #e2e8f0;display:flex;align-items:center}
.sched-cell{flex:1;padding:4px 8px;border-right:1px solid #f1f5f9;min-width:160px;display:flex;flex-direction:column;gap:3px;justify-content:center}
.sched-chip{display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:8px;cursor:pointer;transition:opacity .1s}
.sched-chip:hover{opacity:.85}
.chip--online{background:#e0f2fe;border:1px solid #7dd3fc;color:#0369a1}
.chip--manual{background:#ede9fe;border:1px solid #c4b5fd;color:#4c1d95}
.chip--done{background:#dcfce7;border:1px solid #86efac;color:#166534}
.chip--cancel{background:#f1f5f9;border:1px solid #e2e8f0;color:#94a3b8;text-decoration:line-through}
.sc-source{font-size:13px;flex-shrink:0}
.sc-body{display:flex;flex-direction:column;min-width:0;flex:1}
.sc-name{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc-svc{font-size:11px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sc-end{font-size:11px;opacity:.65;flex-shrink:0}
.emp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.emp-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px}
.emp-card-top{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.emp-avatar-lg{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;flex-shrink:0}
.emp-card-info{flex:1}
.emp-card-name{font-size:16px;font-weight:700;color:#1e293b;margin:0 0 2px}
.emp-card-role{font-size:13px;color:#64748b;margin:0 0 2px}
.emp-card-phone{font-size:12px;color:#94a3b8;margin:0}
.emp-card-services{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}
.svc-tag{font-size:11px;padding:3px 9px;border-radius:20px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}
.svc-tag--empty{background:#fef3c7;color:#92400e;border-color:#fde68a}
.emp-card-stats{display:flex;gap:12px;border-top:1px solid #f1f5f9;padding-top:10px}
.emp-stat{flex:1;text-align:center}
.emp-stat-val{display:block;font-size:20px;font-weight:700;color:#4f46e5}
.emp-stat-lbl{display:block;font-size:11px;color:#94a3b8}
.emp-picker{display:flex;flex-direction:column;gap:8px}
.emp-pick-card{display:flex;align-items:center;gap:12px;padding:12px 14px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer;background:#fff;transition:all .15s}
.emp-pick-card:hover:not(.ep--full){border-color:#6366f1;background:#fafaff}
.ep--selected{border-color:#4f46e5!important;background:#eef2ff!important}
.ep--full{opacity:.5;cursor:not-allowed}
.ep-avatar{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#fff;flex-shrink:0}
.ep-info{flex:1}
.ep-name{display:block;font-size:14px;font-weight:700;color:#1e293b}
.ep-role{display:block;font-size:12px;color:#64748b}
.ep-slots{display:flex;flex-direction:column;align-items:flex-end;flex-shrink:0;gap:3px}
.ep-free{font-size:12px;font-weight:600;color:#16a34a;background:#dcfce7;padding:2px 8px;border-radius:20px}
.ep-free--none{color:#dc2626!important;background:#fee2e2!important}
.ep-busy{font-size:11px;color:#94a3b8}
.slots-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:6px;margin-top:4px}
.slot-btn{padding:8px 4px;border-radius:8px;border:1px solid #e2e8f0;font-size:13px;font-weight:500;cursor:pointer;background:#f8fafc;color:#475569;transition:all .12s}
.slot--free:hover{border-color:#6366f1;color:#4f46e5;background:#eef2ff}
.slot--sel{background:#4f46e5!important;color:#fff!important;border-color:#4f46e5!important}
.slot--busy{background:#f1f5f9!important;color:#cbd5e1!important;border-color:#e2e8f0!important;cursor:not-allowed!important;text-decoration:line-through}
.busy-bar{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.busy-lbl{font-size:12px;font-weight:700;color:#475569;flex-shrink:0}
.busy-dots{display:flex;gap:3px;flex-wrap:wrap;flex:1}
.busy-dot{width:8px;height:8px;border-radius:50%;display:inline-block;flex-shrink:0}
.bd--green{background:#22c55e}.bd--red{background:#ef4444}
.busy-hint{font-size:11px;color:#94a3b8;display:flex;align-items:center;gap:4px}
.booking-summary{background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;padding:14px 16px;margin-bottom:16px}
.summary-title{font-size:13px;font-weight:700;color:#3730a3;margin:0 0 10px}
.summary-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid #c7d2fe;color:#3730a3}
.summary-row:last-child{border:none}
.bookings-table{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}
.table-head{display:grid;grid-template-columns:1.5fr 1.2fr 1.2fr 1.4fr 1fr 1fr .4fr;gap:8px;padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.05em}
.table-empty{padding:32px;text-align:center;color:#94a3b8;font-size:14px}
.table-row{display:grid;grid-template-columns:1.5fr 1.2fr 1.2fr 1.4fr 1fr 1fr .4fr;gap:8px;padding:12px 16px;align-items:center;border-bottom:1px solid #f1f5f9;font-size:13px;transition:background .1s}
.table-row:hover{background:#fafbff}
.row--online{border-left:3px solid #0ea5e9}.row--manual{border-left:3px solid #6366f1}
.td{color:#475569}
.td-name{font-weight:700;color:#1e293b;display:flex;flex-direction:column}
.td-phone{font-size:11px;color:#94a3b8;font-weight:400}
.td-date{font-size:12px;line-height:1.6}
.td-emp{display:flex;align-items:center;gap:6px}
.emp-mini{width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0}
.src-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px;white-space:nowrap}
.src--online{background:#e0f2fe;color:#0369a1}.src--manual{background:#ede9fe;color:#4c1d95}
.status-sel{font-size:12px;padding:4px 8px;border-radius:8px;border:1px solid #d1d5db;outline:none;cursor:pointer;font-family:inherit}
.status-badge{display:inline-block;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px}
.st--pending{background:#fef3c7;color:#92400e}.st--done{background:#dcfce7;color:#166534}.st--cancel{background:#f1f5f9;color:#94a3b8}
.filter-select{padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;color:#374151;outline:none;cursor:pointer}
.date-input{padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:13px;background:#fff;color:#374151;outline:none}
.form-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;max-width:800px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.form-group{display:flex;flex-direction:column;gap:5px;margin-bottom:16px}
.form-group label{font-size:13px;font-weight:600;color:#374151}
.form-hint{font-size:12px;color:#94a3b8;margin:0}
.form-group input,.form-group select,.form-group textarea{padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;color:#1e293b;background:#fff;outline:none;width:100%;transition:border .15s;font-family:inherit}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
.inp-err{border-color:#f87171!important}
.err-msg{font-size:12px;color:#ef4444}
.form-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:8px}
.color-picker{display:flex;gap:8px;flex-wrap:wrap;padding-top:4px}
.color-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .15s}
.color-dot--on{border-color:#1e293b;transform:scale(1.15)}
.color-dot:hover{transform:scale(1.1)}
.checkboxes{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.cb-item{display:flex;align-items:center;gap:6px;font-size:13px;color:#374151;cursor:pointer}
.cb-item input{width:14px;height:14px;cursor:pointer}
.cs-scroll{overflow-x:auto;border-radius:12px;border:1px solid #e2e8f0}
.cs-grid,.cs-row{display:flex}
.cs-grid{background:#f8fafc;border-radius:12px 12px 0 0;border-bottom:2px solid #e2e8f0}
.cs-head-time{width:60px;flex-shrink:0;padding:10px 12px;font-size:11px;font-weight:700;color:#94a3b8;border-right:1px solid #e2e8f0}
.cs-head-emp{flex:1;padding:8px 12px;font-size:12px;font-weight:700;color:#1e293b;border-right:1px solid #e2e8f0;display:flex;align-items:center;gap:6px;min-width:130px}
.cs-row{border-bottom:1px solid #f1f5f9;background:#fff;min-height:40px}
.cs-time{width:60px;flex-shrink:0;padding:8px 12px;font-size:12px;font-weight:700;color:#94a3b8;border-right:1px solid #e2e8f0;display:flex;align-items:center}
.cs-cell{flex:1;padding:4px 8px;border-right:1px solid #f1f5f9;display:flex;flex-direction:column;gap:2px;justify-content:center;min-width:130px}
.cs-chip{font-size:11px;padding:2px 8px;border-radius:20px;font-weight:500}
.cs--online{background:#e0f2fe;color:#0369a1}.cs--manual{background:#ede9fe;color:#4c1d95}
.cs-free{font-size:11px;color:#d1d5db}
.client-sched{margin-top:28px}
.section-title{font-size:15px;font-weight:700;color:#1e293b;margin-bottom:12px}
.search-row{margin-bottom:20px}
.search-inp{width:100%;max-width:440px;padding:12px 16px;border:1px solid #d1d5db;border-radius:10px;font-size:15px;background:#fff;color:#1e293b;outline:none}
.search-inp:focus{border-color:#6366f1}
.my-list{display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
.my-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.my-left{display:flex;align-items:center;gap:12px}
.my-icon{font-size:28px}
.my-svc{font-size:15px;font-weight:700;color:#1e293b;margin:0 0 3px}
.my-meta{font-size:12px;color:#64748b;margin:0 0 4px}
.my-emp{font-size:12px;color:#475569;margin:0;display:flex;align-items:center;gap:5px}
.my-right{display:flex;flex-direction:column;gap:6px;align-items:flex-end}
.toast-success{margin-top:16px;padding:14px 20px;background:#dcfce7;border:1px solid #86efac;border-radius:10px;font-size:14px;font-weight:600;color:#166534}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:100}
.modal{background:#fff;border-radius:16px;width:420px;max-width:92vw;overflow:hidden}
.modal-head{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid #f1f5f9}
.modal-head h3{font-size:16px;font-weight:700;color:#1e293b;margin:0}
.modal-close{background:none;border:none;font-size:18px;color:#94a3b8;cursor:pointer;line-height:1}
.modal-close:hover{color:#1e293b}
.modal-body{padding:16px 24px}
.modal-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #f8fafc;font-size:14px;color:#64748b}
.modal-row:last-child{border:none}
.modal-row strong{color:#1e293b}
.modal-footer{padding:14px 24px;border-top:1px solid #f1f5f9;display:flex;gap:10px;justify-content:flex-end;align-items:center}
.empty-msg{text-align:center;color:#94a3b8;font-size:14px;padding:32px}
/* STATUS ranglari */
.st--pending {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.st--done {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.st--cancel {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

/* select ichidagi rang */
.status-sel.st--pending {
  background: #fef3c7;
  color: #92400e;
}

.status-sel.st--done {
  background: #dcfce7;
  color: #166534;
}

.status-sel.st--cancel {
  background: #f1f5f9;
  color: #64748b;
}

/* form error */
.inp-err {
  border-color: #ef4444 !important;
  background: #fef2f2;
}

.err-msg {
  font-size: 11px;
  color: #dc2626;
  margin-top: 4px;
}

/* success toast */
.toast-success {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #22c55e;
  color: #fff;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

/* modal */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 700;
}

.modal-body {
  padding: 14px 16px;
}

.modal-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px solid #f1f5f9;
}

.modal-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
  justify-content: flex-end;
}

.modal-close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
}
@media(max-width:680px){
  .form-row{grid-template-columns:1fr}
  .table-head,.table-row{grid-template-columns:1.5fr 1fr 1fr}
  .role-cards{flex-direction:column;align-items:center}
  .page-header{flex-direction:column}
  .nav-tabs{gap:2px}
  .nav-tab{padding:6px 10px;font-size:12px}
  .emp-grid{grid-template-columns:1fr}
}
</style>