<template>
  <div class="flex min-h-screen bg-gray-50">
    <NavbarDashboard />
    <div class="flex-1 pl-64 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8 border-b border-gray-200 pb-5">
          <h1 class="text-3xl font-bold text-gray-900">ดาวน์โหลดรายงานข้อมูล (Excel)</h1>
          <p class="mt-2 text-sm text-gray-500">
            ส่งออกผลลัพธ์การประเมินทั้งหมดเป็นไฟล์ Excel รวมถึงข้อมูลดิบและกราฟสรุปผล
          </p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div class="flex flex-col items-center justify-center space-y-6 py-12">
            <div class="w-24 h-24 bg-[#7AE2CF]/20 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-[#06202B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">สร้างรายงานและดาวน์โหลด</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                ระบบจะทำการรวบรวมข้อมูลการประเมินทั้งหมด จัดทำเป็นตารางข้อมูลและสร้างกราฟวิเคราะห์ผลเพื่อแนบลงในไฟล์ Excel
              </p>
            </div>
            <button
              @click="generateExcel"
              :disabled="isGenerating"
              class="mt-4 px-8 py-4 bg-[#06202B] hover:bg-[#0a3d52] text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg v-if="isGenerating" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{{ isGenerating ? 'กำลังประมวลผล...' : 'ดาวน์โหลดไฟล์ Excel' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div style="position:absolute;left:-9999px;top:-9999px;">
      <canvas id="gapBarCanvas"></canvas>
      <canvas id="categoryRadarCanvas"></canvas>
      <canvas id="rawHistCanvas"></canvas>
      <canvas id="topBottomCanvas"></canvas>
      <canvas id="companyBarCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Chart, registerables } from 'chart.js'
import NavbarDashboard from '../../components/NavbarDashboard.vue'

Chart.register(...registerables)

const isGenerating = ref(false)

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

const calculateAverage = (scoreCounts) => {
  if (!scoreCounts) return 0
  let totalScore = 0, totalVotes = 0
  for (let i = 1; i <= 5; i++) {
    totalScore += i * (scoreCounts[i] || 0)
    totalVotes += (scoreCounts[i] || 0)
  }
  return totalVotes > 0 ? totalScore / totalVotes : 0
}

const renderChartOnCanvas = (canvas, config) =>
  new Promise(resolve => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const chart = new Chart(ctx, {
      ...config,
      options: { ...config.options, responsive: false, animation: false }
    })
    setTimeout(() => resolve(chart), 350)
  })

// ✅ คำนวณ row height จากข้อความจริง — แม่นยำสำหรับ Thai + email ยาว
const calcDynamicRowHeight = (text, colWidthChars, fontSize = 11, minHeight = 20) => {
  if (!text) return minHeight
  const str = String(text)

  // Excel col width unit → px (Calibri 11pt default: 1 unit ≈ 7.0px)
  const colWidthPx = colWidthChars * 7.0

  // Thai/Latin mixed: average char width ≈ fontSize * 0.58px
  // อีเมล (ASCII) แคบกว่า Thai เล็กน้อย แต่ใช้ค่าเดียวกันเพื่อ safety margin
  const avgCharWidthPx = fontSize * 0.58

  const charsPerLine = Math.max(1, Math.floor(colWidthPx / avgCharWidthPx))
  const lines        = Math.max(1, Math.ceil(str.length / charsPerLine))

  // Excel row height unit = pt; line height ≈ fontSize * 1.5pt + padding
  return Math.max(minHeight, lines * (fontSize * 1.5) + 6)
}

// คำนวณจากหลาย cell แล้วเอา max
const calcRowHeightFromCells = (cells, minHeight = 20) => {
  const heights = cells.map(({ text, colWidth, fontSize = 11 }) =>
    calcDynamicRowHeight(text, colWidth, fontSize, minHeight)
  )
  return Math.max(minHeight, ...heights)
}

const addSectionTitle = (sheet, rowNum, text, colspan, bgArgb = 'FF06202B') => {
  const cell = sheet.getCell(`A${rowNum}`)
  cell.value     = text
  cell.font      = { bold: true, size: 13, name: 'Calibri', color: { argb: 'FFFFFFFF' } }
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } }
  cell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 }
  const endCol   = sheet.getColumn(colspan).letter
  sheet.mergeCells(`A${rowNum}:${endCol}${rowNum}`)
  sheet.getRow(rowNum).height = 28
}

const addChartDescription = (sheet, rowNum, text, colspan, bgArgb = 'FFECF6FD') => {
  const cell = sheet.getCell(`A${rowNum}`)
  cell.value     = text
  cell.font      = { italic: true, size: 10, name: 'Calibri', color: { argb: 'FF333333' } }
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } }
  cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true, indent: 1 }
  const endCol   = sheet.getColumn(colspan).letter
  sheet.mergeCells(`A${rowNum}:${endCol}${rowNum}`)
  sheet.getRow(rowNum).height = 52
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════

const generateExcel = async () => {
  isGenerating.value = true
  try {
    const currentYear = new Date().getFullYear()

    const [questionsRes, categoriesRes, resultsRes, completionRes, usersRes, rawAnswersRes] = await Promise.all([
      axios.get('/api/questions'),
      axios.get('/api/categories'),
      axios.get(`/api/analytics/question-results?year=${currentYear}`),
      axios.get('/api/analytics/completion-status'),
      axios.get('/api/users/users'),
      axios.get(`/api/analytics/raw-answers?year=${currentYear}`)
    ])

    const allQuestions      = questionsRes.data
    const allCategories     = categoriesRes.data
    const { current, future } = resultsRes.data
    const completionStatus  = completionRes.data
    const users             = usersRes.data
    const rawAnswers        = rawAnswersRes.data

    // ── chartData ──────────────────────────────────────────────────────────────
    const chartData = allQuestions.map((q, idx) => {
      const category      = allCategories.find(c => c.id === q.categoryId)
      const currentCounts = current[idx] || { 1:0,2:0,3:0,4:0,5:0 }
      const futureCounts  = future[idx]  || { 1:0,2:0,3:0,4:0,5:0 }
      return {
        questionText: q.text,
        categoryName: category ? category.name : '-',
        currentScore: calculateAverage(currentCounts),
        futureScore:  calculateAverage(futureCounts),
      }
    })

    const Q_COUNT = allQuestions.length

    // ── statusMap ──────────────────────────────────────────────────────────────
    const statusMap = {}
    completionStatus.forEach(u => {
      statusMap[u.email_user || u.email || u.id] = u.status === 'done' ? 'ทำแล้ว' : 'ยังไม่ทำ'
    })

    const companyStats = {}
    users.forEach(u => {
      const company = u.company_user || u.company || 'ไม่ระบุบริษัท'
      const email   = u.email_user   || u.email
      if (!companyStats[company]) companyStats[company] = { done: 0, pending: 0 }
      statusMap[email] === 'ทำแล้ว' ? companyStats[company].done++ : companyStats[company].pending++
    })
    const companyNames = Object.keys(companyStats)

    // ── rawByEmail ─────────────────────────────────────────────────────────────
    const rawByEmail = {}
    rawAnswers.forEach(r => { rawByEmail[r.userEmail || r.email] = r.answers || [] })

    const getAnswer = (answers, qId) => {
      const f = answers.find(a => a.questionId === qId)
      return f ? { current: f.currentScore, future: f.futureScore } : { current: '-', future: '-' }
    }

    // ── category radar ─────────────────────────────────────────────────────────
    const catMap = {}
    chartData.forEach(q => {
      if (!catMap[q.categoryName]) catMap[q.categoryName] = { cur: [], fut: [] }
      catMap[q.categoryName].cur.push(q.currentScore)
      catMap[q.categoryName].fut.push(q.futureScore)
    })
    const catNames  = Object.keys(catMap)
    const catCurAvg = catNames.map(n => parseFloat((catMap[n].cur.reduce((a,b)=>a+b,0)/catMap[n].cur.length).toFixed(2)))
    const catFutAvg = catNames.map(n => parseFloat((catMap[n].fut.reduce((a,b)=>a+b,0)/catMap[n].fut.length).toFixed(2)))

    // ── top/bottom 10 ──────────────────────────────────────────────────────────
    const ranked  = [...chartData.map((q,i)=>({...q,idx:i}))].sort((a,b)=>b.currentScore-a.currentScore)
    const top10   = ranked.slice(0,10)
    const bottom10= ranked.slice(-10).reverse()

    // ══════════════════════════════════════════════════════════════════════════
    // RENDER CHARTS — ทีละอัน capture ทันที
    // ══════════════════════════════════════════════════════════════════════════

    // Chart A1: Gap Bar
    const sortedByGap = [...chartData.map((q,i)=>({...q,idx:i}))]
      .sort((a,b)=>(b.futureScore-b.currentScore)-(a.futureScore-a.currentScore))
    const gapBarH      = Math.max(900, Q_COUNT * 20 + 220)
    const gapBarCanvas = document.getElementById('gapBarCanvas')
    gapBarCanvas.width = 1400; gapBarCanvas.height = gapBarH
    const c1 = await renderChartOnCanvas(gapBarCanvas, {
      type: 'bar',
      data: {
        labels: sortedByGap.map(q=>`Q${q.idx+1}`),
        datasets: [
          { label:'คะแนนปัจจุบัน',            data: sortedByGap.map(q=>parseFloat(q.currentScore.toFixed(2))), backgroundColor:'rgba(6,32,43,0.82)', borderColor:'#06202b', borderWidth:1, borderRadius:3, barPercentage:0.7, categoryPercentage:0.8 },
          { label:'คะแนนที่ต้องการในอนาคต',   data: sortedByGap.map(q=>parseFloat(q.futureScore.toFixed(2))),  backgroundColor:'rgba(122,226,207,0.85)', borderColor:'#7ae2cf', borderWidth:1, borderRadius:3, barPercentage:0.7, categoryPercentage:0.8 }
        ]
      },
      options: {
        indexAxis:'y',
        layout:{ padding:{ top:20,right:60,bottom:20,left:20 } },
        plugins:{
          legend:{ position:'top', labels:{ font:{size:16,family:'Calibri'}, padding:20, boxWidth:22 } },
          title:{ display:true, text:[`คะแนนปัจจุบัน vs อนาคต เรียงตาม Gap (สูงสุด → ต่ำสุด)`,`ปี ${currentYear} — ช่วงคะแนน 1–5`], font:{size:20,weight:'bold',family:'Calibri'}, padding:{bottom:24}, color:'#06202b' }
        },
        scales:{
          x:{ min:0, max:5, ticks:{stepSize:1,font:{size:13}}, title:{display:true,text:'คะแนนเฉลี่ย (1–5)',font:{size:14}}, grid:{color:'rgba(0,0,0,0.07)'} },
          y:{ ticks:{font:{size:Q_COUNT>60?10:12},autoSkip:false}, grid:{display:false} }
        }
      }
    })
    const imgGapBar = gapBarCanvas.toDataURL('image/png')
    c1.destroy()

    // Chart A2: Radar
    const radarCanvas = document.getElementById('categoryRadarCanvas')
    radarCanvas.width = 900; radarCanvas.height = 900
    const c2 = await renderChartOnCanvas(radarCanvas, {
      type:'radar',
      data:{
        labels: catNames,
        datasets:[
          { label:'ปัจจุบัน', data:catCurAvg, backgroundColor:'rgba(6,32,43,0.18)', borderColor:'#06202b', borderWidth:2.5, pointBackgroundColor:'#06202b', pointRadius:5 },
          { label:'อนาคต',    data:catFutAvg, backgroundColor:'rgba(122,226,207,0.25)', borderColor:'#5cc4b0', borderWidth:2.5, pointBackgroundColor:'#5cc4b0', pointRadius:5 }
        ]
      },
      options:{
        layout:{padding:40},
        plugins:{
          legend:{ position:'bottom', labels:{font:{size:17,family:'Calibri'},padding:20} },
          title:{ display:true, text:[`คะแนนเฉลี่ยรายหมวดหมู่ ปัจจุบัน vs อนาคต`,`ปี ${currentYear}`], font:{size:20,weight:'bold',family:'Calibri'}, padding:{bottom:20}, color:'#06202b' }
        },
        scales:{ r:{ min:0, max:5, ticks:{stepSize:1,font:{size:13},backdropColor:'transparent'}, pointLabels:{font:{size:14,family:'Calibri'},color:'#1a1a1a'}, grid:{color:'rgba(0,0,0,0.1)'}, angleLines:{color:'rgba(0,0,0,0.12)'} } }
      }
    })
    const imgRadar = radarCanvas.toDataURL('image/png')
    c2.destroy()

    // Chart B1: Histogram
    const userAvgScores = users.map(u => {
      const email   = u.email_user || u.email
      const answers = rawByEmail[email] || []
      if (!answers.length) return null
      let curSum=0,futSum=0,curCount=0,futCount=0
      answers.forEach(a => {
        const c=parseFloat(a.currentScore), f=parseFloat(a.futureScore)
        if(c>=1&&c<=5){curSum+=c;curCount++}
        if(f>=1&&f<=5){futSum+=f;futCount++}
      })
      return { current: curCount>0?curSum/curCount:null, future: futCount>0?futSum/futCount:null }
    }).filter(x=>x&&(x.current!==null||x.future!==null))

    const binEdges=['1.0–1.5','1.5–2.0','2.0–2.5','2.5–3.0','3.0–3.5','3.5–4.0','4.0–4.5','4.5–5.0']
    const binE=[1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.01]
    const curBins=Array(8).fill(0), futBins=Array(8).fill(0)
    userAvgScores.forEach(({current,future})=>{
      if(current!==null){ const ci=binE.findIndex((e,i)=>i<8&&current>=e&&current<binE[i+1]); if(ci>=0)curBins[ci]++ }
      if(future!==null){  const fi=binE.findIndex((e,i)=>i<8&&future>=e&&future<binE[i+1]);   if(fi>=0)futBins[fi]++ }
    })

    const rawHistCanvas=document.getElementById('rawHistCanvas')
    rawHistCanvas.width=1100; rawHistCanvas.height=560
    const c4=await renderChartOnCanvas(rawHistCanvas,{
      type:'bar',
      data:{ labels:binEdges, datasets:[
        { label:'ปัจจุบัน', data:curBins, backgroundColor:'rgba(6,32,43,0.82)', borderColor:'#06202b', borderWidth:1, borderRadius:4, barPercentage:0.72, categoryPercentage:0.82 },
        { label:'อนาคต',   data:futBins, backgroundColor:'rgba(122,226,207,0.85)', borderColor:'#5cc4b0', borderWidth:1, borderRadius:4, barPercentage:0.72, categoryPercentage:0.82 }
      ]},
      options:{
        layout:{padding:{top:24,right:40,bottom:24,left:24}},
        plugins:{
          legend:{position:'top',labels:{font:{size:16,family:'Calibri'},padding:18}},
          title:{display:true,text:[`การกระจายคะแนนเฉลี่ยรายบุคคล (Distribution of Individual Scores)`,`ปี ${currentYear}`],font:{size:19,weight:'bold',family:'Calibri'},padding:{bottom:22},color:'#06202b'}
        },
        scales:{
          x:{title:{display:true,text:'ช่วงคะแนนเฉลี่ย',font:{size:14,family:'Calibri'}},ticks:{font:{size:13}},grid:{display:false}},
          y:{title:{display:true,text:'จำนวนผู้ประเมิน (คน)',font:{size:14,family:'Calibri'}},ticks:{stepSize:1,font:{size:13}},grid:{color:'rgba(0,0,0,0.07)'}}
        }
      }
    })
    const imgRawHist=rawHistCanvas.toDataURL('image/png')
    c4.destroy()

    // Chart B2: Top/Bottom 10
    const tb10Labels=[...top10.map(q=>`Q${q.idx+1} (สูง)`),...bottom10.map(q=>`Q${q.idx+1} (ต่ำ)`)]
    const tb10CurVals=[...top10.map(q=>parseFloat(q.currentScore.toFixed(2))),...bottom10.map(q=>parseFloat(q.currentScore.toFixed(2)))]
    const tb10FutVals=[...top10.map(q=>parseFloat(q.futureScore.toFixed(2))),...bottom10.map(q=>parseFloat(q.futureScore.toFixed(2)))]
    const tb10Colors=[...top10.map(()=>'rgba(6,32,43,0.82)'),...bottom10.map(()=>'rgba(220,53,69,0.78)')]
    const tbCanvas=document.getElementById('topBottomCanvas')
    tbCanvas.width=1200; tbCanvas.height=820
    const c5=await renderChartOnCanvas(tbCanvas,{
      type:'bar',
      data:{ labels:tb10Labels, datasets:[
        { label:'คะแนนปัจจุบัน', data:tb10CurVals, backgroundColor:tb10Colors, borderColor:tb10Colors, borderWidth:1, borderRadius:3, barPercentage:0.65, categoryPercentage:0.82 },
        { label:'คะแนนอนาคต',   data:tb10FutVals, backgroundColor:'rgba(122,226,207,0.80)', borderColor:'#5cc4b0', borderWidth:1, borderRadius:3, barPercentage:0.65, categoryPercentage:0.82 }
      ]},
      options:{
        indexAxis:'y',
        layout:{padding:{top:20,right:60,bottom:20,left:20}},
        plugins:{
          legend:{position:'top',labels:{font:{size:15,family:'Calibri'},padding:18}},
          title:{display:true,text:['Top 10 คะแนนสูงสุด (■ เข้ม) vs Bottom 10 คะแนนต่ำสุด (■ แดง)',`ปี ${currentYear} — เปรียบเทียบปัจจุบัน & อนาคต`],font:{size:19,weight:'bold',family:'Calibri'},padding:{bottom:22},color:'#06202b'}
        },
        scales:{
          x:{min:0,max:5,ticks:{stepSize:1,font:{size:13}},title:{display:true,text:'คะแนนเฉลี่ย (1–5)',font:{size:14}},grid:{color:'rgba(0,0,0,0.07)'}},
          y:{ticks:{font:{size:13},autoSkip:false},grid:{display:false}}
        }
      }
    })
    const imgTopBottom=tbCanvas.toDataURL('image/png')
    c5.destroy()

    // Chart C: Company Bar
    const barChartHeight=Math.max(420,companyNames.length*72+180)
    const barCanvas=document.getElementById('companyBarCanvas')
    barCanvas.width=1400; barCanvas.height=barChartHeight
    const doneData=companyNames.map(n=>companyStats[n].done)
    const pendingData=companyNames.map(n=>companyStats[n].pending)
    const totalData=companyNames.map(n=>companyStats[n].done+companyStats[n].pending)
    const c3=await renderChartOnCanvas(barCanvas,{
      type:'bar',
      data:{ labels:companyNames, datasets:[
        { label:'ทำแล้ว',   data:doneData,    backgroundColor:'rgba(6,32,43,0.88)', borderColor:'#06202b', borderWidth:1, borderRadius:{topLeft:3,bottomLeft:3} },
        { label:'ยังไม่ทำ', data:pendingData, backgroundColor:'rgba(220,53,69,0.75)', borderColor:'#dc3545', borderWidth:1, borderRadius:{topRight:3,bottomRight:3} }
      ]},
      options:{
        indexAxis:'y',
        layout:{padding:{top:24,right:80,bottom:24,left:24}},
        scales:{
          x:{stacked:true,title:{display:true,text:'จำนวนผู้ประเมิน (คน)',font:{size:15,family:'Calibri'}},ticks:{font:{size:13},stepSize:1},grid:{color:'rgba(0,0,0,0.07)'}},
          y:{stacked:true,ticks:{font:{size:14,family:'Calibri'}},grid:{display:false}}
        },
        plugins:{
          legend:{position:'top',labels:{font:{size:16,family:'Calibri'},padding:20,boxWidth:22}},
          title:{display:true,text:[`สถานะการทำแบบประเมิน แยกตามบริษัท`,`ปี ${currentYear}`],font:{size:20,weight:'bold',family:'Calibri'},padding:{bottom:20},color:'#06202b'},
          tooltip:{callbacks:{
            label:(ctx)=>{ const t=totalData[ctx.dataIndex]; const p=t>0?Math.round((ctx.parsed.x/t)*100):0; return ` ${ctx.dataset.label}: ${ctx.parsed.x} คน (${p}%)` },
            afterBody:(items)=>items.length?[`รวม: ${totalData[items[0].dataIndex]} คน`]:[]
          }}
        }
      }
    })
    const imgCompanyBar=barCanvas.toDataURL('image/png')
    c3.destroy()

    // ══════════════════════════════════════════════════════════════════════════
    // BUILD WORKBOOK
    // ══════════════════════════════════════════════════════════════════════════
    const wb = new ExcelJS.Workbook()
    wb.creator = 'Safety Culture Survey System'
    wb.created = new Date()

    // ── Sheet borders helper ───────────────────────────────────────────────────
    const thinBorder = (color='FFDDDDDD') => ({
      top:{style:'thin',color:{argb:color}}, bottom:{style:'thin',color:{argb:color}},
      left:{style:'thin',color:{argb:color}}, right:{style:'thin',color:{argb:color}}
    })
    const headerBorder = () => thinBorder('FFAAAAAA')

    // ══════════════════════════════════════════════════════════════════════════
    // SHEET A: การวิเคราะห์ข้อมูลรายข้อ
    // ══════════════════════════════════════════════════════════════════════════
    const analysisSheet = wb.addWorksheet('การวิเคราะห์ข้อมูลรายข้อ')

    // Cover
    analysisSheet.mergeCells('A1:F1')
    Object.assign(analysisSheet.getCell('A1'), {
      value: `รายงานการวิเคราะห์ผลการประเมินวัฒนธรรมความปลอดภัย  ปี ${currentYear}`,
      font: { bold:true, size:14, name:'Calibri', color:{argb:'FFFFFFFF'} },
      fill: { type:'pattern', pattern:'solid', fgColor:{argb:'FF06202B'} },
      alignment: { horizontal:'center', vertical:'middle' }
    })
    analysisSheet.getRow(1).height = 36
    analysisSheet.addRow([])

    // Columns
    analysisSheet.columns = [
      { key:'qno',      width:8  },
      { key:'category', width:28 },
      { key:'question', width:65 },
      { key:'current',  width:22 },
      { key:'future',   width:22 },
      { key:'gap',      width:22 },
    ]

    // Header row 3
    const aHeaderRow = analysisSheet.getRow(3)
    ;['ข้อที่','หมวดหมู่','คำถาม','คะแนนปัจจุบัน\n(เฉลี่ย)','คะแนนอนาคต\n(เฉลี่ย)','Gap\n(อนาคต − ปัจจุบัน)']
      .forEach((h,i)=>{
        const cell = aHeaderRow.getCell(i+1)
        cell.value     = h
        cell.font      = { bold:true, color:{argb:'FFFFFFFF'}, name:'Calibri', size:11 }
        cell.fill      = { type:'pattern', pattern:'solid', fgColor:{argb:'FF06202B'} }
        cell.alignment = { vertical:'middle', horizontal:'center', wrapText:true }
        cell.border    = headerBorder()
      })
    aHeaderRow.height = 36

    const SCORE_FILL   = { low:'FFFCE4D6', mid:'FFFFFFCC', high:'FFE2EFDA' }
    const getScoreFill = s => s<2.5?SCORE_FILL.low:s<3.5?SCORE_FILL.mid:SCORE_FILL.high
    const catColorMap  = {}
    const CAT_COLORS   = ['FFF0F8FF','FFF5FFFE','FFFFF8F0','FFF8F0FF','FFF0FFF0']
    catNames.forEach((n,i) => { catColorMap[n] = CAT_COLORS[i%CAT_COLORS.length] })

    chartData.forEach((q, idx) => {
      const cur    = parseFloat(q.currentScore.toFixed(4))
      const fut    = parseFloat(q.futureScore.toFixed(4))
      const gap    = parseFloat((fut-cur).toFixed(4))
      const rowNum = idx+4
      const row    = analysisSheet.getRow(rowNum)
      const rowBg  = catColorMap[q.categoryName] || 'FFFFFFFF'

      row.getCell(1).value = idx+1
      row.getCell(2).value = q.categoryName
      row.getCell(3).value = q.questionText
      row.getCell(4).value = cur;  row.getCell(4).numFmt = '0.00'
      row.getCell(5).value = fut;  row.getCell(5).numFmt = '0.00'
      row.getCell(6).value = gap;  row.getCell(6).numFmt = '0.00'

      row.eachCell({ includeEmpty:true }, (cell,cn) => {
        cell.font   = { name:'Calibri', size:11 }
        cell.fill   = { type:'pattern', pattern:'solid', fgColor:{argb:rowBg} }
        cell.border = thinBorder()
        switch(cn){
          case 1: cell.alignment={horizontal:'center',vertical:'middle'}; break
          case 2: cell.alignment={vertical:'middle',wrapText:true}; break
          case 3: cell.alignment={wrapText:true,vertical:'top'}; break
          case 4:
            cell.fill      = {type:'pattern',pattern:'solid',fgColor:{argb:getScoreFill(cur)}}
            cell.alignment = {horizontal:'center',vertical:'middle'}; break
          case 5:
            cell.fill      = {type:'pattern',pattern:'solid',fgColor:{argb:getScoreFill(fut)}}
            cell.alignment = {horizontal:'center',vertical:'middle'}; break
          case 6:
            cell.font      = {bold:true,name:'Calibri',size:11,color:{argb:gap>=0?'FF1A6B1A':'FFB22222'}}
            cell.alignment = {horizontal:'center',vertical:'middle'}; break
        }
      })

      // ✅ Dynamic height — เอา max ของ category และ question text
      row.height = calcRowHeightFromCells([
        { text: q.categoryName, colWidth: 28 },
        { text: q.questionText,  colWidth: 65 },
      ], 22)
    })

    // Summary
    const firstDataRow = 4
    const lastDataRow  = chartData.length+3
    const sumRowNum    = chartData.length+4
    const sumRow       = analysisSheet.getRow(sumRowNum)
    sumRow.getCell(3).value = 'ค่าเฉลี่ยรวมทุกข้อ'
    sumRow.getCell(4).value = { formula:`AVERAGE(D${firstDataRow}:D${lastDataRow})` }
    sumRow.getCell(5).value = { formula:`AVERAGE(E${firstDataRow}:E${lastDataRow})` }
    sumRow.getCell(6).value = { formula:`E${sumRowNum}-D${sumRowNum}` }
    for(let i=1;i<=6;i++){
      const cell = sumRow.getCell(i)
      cell.font      = { bold:true, name:'Calibri', size:11, color:{argb:i===3?'FF06202B':'FF000000'} }
      cell.fill      = { type:'pattern', pattern:'solid', fgColor:{argb:'FFFFE0B2'} }
      cell.alignment = { horizontal:i<=2?'left':'center', vertical:'middle' }
      cell.border    = { top:{style:'medium',color:{argb:'FF06202B'}}, bottom:{style:'medium',color:{argb:'FF06202B'}}, left:thinBorder('FFAAAAAA').left, right:thinBorder('FFAAAAAA').right }
      if(i>=4) cell.numFmt='0.00'
    }
    sumRow.height = 28

    // Legend
    const legendRowNum = sumRowNum+1
    analysisSheet.mergeCells(`A${legendRowNum}:F${legendRowNum}`)
    Object.assign(analysisSheet.getCell(`A${legendRowNum}`), {
      value: '  สีคะแนน:  🟥 < 2.5 (ต้องเร่งพัฒนา)   🟨 2.5–3.5 (ปานกลาง)   🟩 > 3.5 (ดี)   |   Gap: บวก = ต้องการสูงกว่าปัจจุบัน',
      font: { italic:true, size:10, name:'Calibri', color:{argb:'FF444444'} },
      fill: { type:'pattern', pattern:'solid', fgColor:{argb:'FFF5F5F5'} },
      alignment: { horizontal:'left', vertical:'middle' }
    })
    analysisSheet.getRow(legendRowNum).height = 20

    // Charts A
    const aChart1TitleRow = legendRowNum+2
    addSectionTitle(analysisSheet, aChart1TitleRow, `  กราฟที่ 1 — คะแนนปัจจุบัน vs อนาคต เรียงตาม Gap (ปี ${currentYear})`, 6)
    const aChart1DescRow  = aChart1TitleRow+1
    addChartDescription(analysisSheet, aChart1DescRow,
      '📊 กราฟแท่งแนวนอนเรียงตาม Gap สูงสุด → ต่ำสุด  ■ เข้ม = คะแนนปัจจุบัน  ■ เขียวอ่อน = คะแนนที่ต้องการในอนาคต  คำถามที่มี Gap สูงสุด (แท่งอนาคตยาวกว่ามาก) = ต้องเร่งพัฒนาก่อน', 6)

    const gapImgH      = Math.min(900, Math.max(600, Q_COUNT*14+220))
    analysisSheet.addImage(
      wb.addImage({ base64:imgGapBar, extension:'png' }),
      { tl:{ col:0, row:aChart1DescRow }, ext:{ width:1180, height:gapImgH } }
    )

    const rowsForGap     = Math.ceil(gapImgH/20)+2
    const aChart2TitleRow= aChart1DescRow+rowsForGap
    addSectionTitle(analysisSheet, aChart2TitleRow, `  กราฟที่ 2 — คะแนนเฉลี่ยรายหมวดหมู่ Radar Chart (ปี ${currentYear})`, 6)
    const aChart2DescRow = aChart2TitleRow+1
    addChartDescription(analysisSheet, aChart2DescRow,
      '🕸️ Radar Chart แสดง Profile รายหมวดหมู่  เส้นเข้ม = ปัจจุบัน  เส้นเขียว = อนาคต  พื้นที่ห่างระหว่างสองเส้น = ช่องว่างที่ต้องพัฒนา  หมวดที่ห่างมากที่สุดควรวางแผนพัฒนาก่อน', 6)
    analysisSheet.addImage(
      wb.addImage({ base64:imgRadar, extension:'png' }),
      { tl:{ col:0, row:aChart2DescRow }, ext:{ width:780, height:780 } }
    )

    // ══════════════════════════════════════════════════════════════════════════
    // SHEET B: ข้อมูลดิบรายบุคคล
    // ══════════════════════════════════════════════════════════════════════════
    const rawSheet   = wb.addWorksheet('ข้อมูลดิบรายบุคคล')
    const rawColumns = [
      { key:'index',    width:7  },
      { key:'name',     width:36 },
      { key:'email',    width:36 },
      { key:'company',  width:26 },
      { key:'position', width:26 },
    ]
    allQuestions.forEach((_,idx) => {
      rawColumns.push({ key:`q${idx+1}_current`, width:13 })
      rawColumns.push({ key:`q${idx+1}_future`,  width:13 })
    })
    rawSheet.columns = rawColumns

    const totalCols = 5+allQuestions.length*2
    rawSheet.mergeCells(1,1,1,totalCols)
    Object.assign(rawSheet.getCell('A1'),{
      value:`ข้อมูลดิบรายบุคคล — Safety Culture Survey ปี ${currentYear}`,
      font:{bold:true,size:13,name:'Calibri',color:{argb:'FFFFFFFF'}},
      fill:{type:'pattern',pattern:'solid',fgColor:{argb:'FF1A3C50'}},
      alignment:{horizontal:'center',vertical:'middle'}
    })
    rawSheet.getRow(1).height=32

    const rawHeaderRow=rawSheet.getRow(2)
    ;['ลำดับ','ชื่อ-นามสกุล','อีเมล','บริษัท','ตำแหน่ง'].forEach((h,i)=>{
      const cell=rawHeaderRow.getCell(i+1)
      cell.value=h; cell.font={bold:true,color:{argb:'FFFFFFFF'},name:'Calibri',size:11}
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF1A3C50'}}
      cell.alignment={vertical:'middle',horizontal:'center',wrapText:true}
      cell.border=headerBorder()
    })
    allQuestions.forEach((_,idx)=>{
      ;[6+idx*2,7+idx*2].forEach((colNum,ci)=>{
        const cell=rawHeaderRow.getCell(colNum)
        cell.value=ci===0?`Q${idx+1}\nปัจจุบัน`:`Q${idx+1}\nอนาคต`
        cell.font={bold:true,color:{argb:'FFFFFFFF'},name:'Calibri',size:10}
        cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:ci===0?'FF1A3C50':'FF2E6B80'}}
        cell.alignment={vertical:'middle',horizontal:'center',wrapText:true}
        cell.border=headerBorder()
      })
    })
    rawHeaderRow.height=34

    const hintRow=rawSheet.getRow(3)
    ;[1,2,3,4,5].forEach(i=>{hintRow.getCell(i).value=''})
    allQuestions.forEach((q,idx)=>{
      const col1=6+idx*2
      hintRow.getCell(col1).value=q.text
      hintRow.getCell(col1).font={italic:true,size:9,name:'Calibri',color:{argb:'FF555555'}}
      hintRow.getCell(col1).alignment={wrapText:true,horizontal:'center',vertical:'top'}
      rawSheet.mergeCells(3,col1,3,col1+1)
    })
    hintRow.eachCell({includeEmpty:true},cell=>{
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFECF6FD'}}
    })
    hintRow.height=44

    const scoreColorMap = {
      5: 'FF4CAF50',  // 🟢 เขียวเข้ม
      4: 'FFFFC107',  // 🟡 เหลือง
      3: 'FFFF9800',  // 🟠 ส้ม
      2: 'FFF44336',  // 🔴 แดง
      1: 'FF795548',  // 🟤 น้ำตาล
    }

    users.forEach((u,idx)=>{
      const email   = u.email_user   || u.email    || ''
      const name    = `${u.title_user||''}${u.name_user||u.name||''}`.trim()
      const company = u.company_user  || u.company  || '-'
      const pos     = u.position_user || u.position || '-'
      const answers = rawByEmail[email] || []
      const rowNum  = idx+4
      const dr      = rawSheet.getRow(rowNum)
      const bgBase  = idx%2===0?'FFFFFFFF':'FFF7FBFF'

      ;[idx+1, name, email, company, pos].forEach((v,i)=>{
        const cell=dr.getCell(i+1)
        cell.value=v
        cell.font={name:'Calibri',size:10}
        cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:bgBase}}
        cell.border=thinBorder('FFEEEEEE')
        // ✅ wrapText เปิดทุก col ที่อาจยาว
        cell.alignment={vertical:'middle',horizontal:i===0?'center':'left',wrapText:i>0}
      })

      allQuestions.forEach((q,qi)=>{
        const {current,future}=getAnswer(answers,q.id)
        ;[[6+qi*2,current],[7+qi*2,future]].forEach(([colNum,val])=>{
          const cell=dr.getCell(colNum)
          cell.value=val
          cell.font={name:'Calibri',size:10}
          const v=parseInt(val)
          cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:(v>=1&&v<=5)?scoreColorMap[v]:bgBase}}
          cell.alignment={horizontal:'center',vertical:'middle'}
          cell.border=thinBorder('FFEEEEEE')
        })
      })

      // ✅ Dynamic height — ครอบคลุมอีเมลยาว
      dr.height = calcRowHeightFromCells([
        { text: name,    colWidth: 36 },
        { text: email,   colWidth: 36 },  // ← อีเมลยาวมักเป็นตัวการหลัก
        { text: company, colWidth: 26 },
        { text: pos,     colWidth: 26 },
      ], 20)
    })

    rawSheet.views=[{state:'frozen',xSplit:5,ySplit:3}]

    // Charts B
    const rawDataEnd=users.length+5
    addSectionTitle(rawSheet,rawDataEnd,`  กราฟที่ 1 — การกระจายคะแนนเฉลี่ยรายบุคคล (ปี ${currentYear})`,10,'FF1A3C50')
    const bChart1DescRow=rawDataEnd+1
    addChartDescription(rawSheet,bChart1DescRow,
      '📊 Histogram การกระจายคะแนนเฉลี่ยรายบุคคล  แกน X = ช่วงคะแนน (1.0–5.0)  แกน Y = จำนวนผู้ประเมิน  ■ เข้ม = ปัจจุบัน  ■ เขียวอ่อน = อนาคต  แท่งที่สูงที่สุด = ช่วงคะแนนที่ผู้ประเมินส่วนใหญ่กระจุกตัวอยู่',
      10,'FFEBF5FB')
    rawSheet.addImage(
      wb.addImage({base64:imgRawHist,extension:'png'}),
      {tl:{col:0,row:bChart1DescRow},ext:{width:960,height:480}}
    )

    const rawChart2Row=bChart1DescRow+Math.ceil(480/20)+2
    addSectionTitle(rawSheet,rawChart2Row,`  กราฟที่ 2 — Top 10 & Bottom 10 คำถาม (ปี ${currentYear})`,10,'FF1A3C50')
    const bChart2DescRow=rawChart2Row+1
    addChartDescription(rawSheet,bChart2DescRow,
      '📊 Top 10 คำถามคะแนนสูงสุด (■ เข้ม) และ Bottom 10 คะแนนต่ำสุด (■ แดง)  ■ เขียวอ่อน = คะแนนอนาคต  คำถามกลุ่ม Bottom ที่มี Gap สูงควรได้รับการ prioritize ก่อน',
      10,'FFEBF5FB')
    rawSheet.addImage(
      wb.addImage({base64:imgTopBottom,extension:'png'}),
      {tl:{col:0,row:bChart2DescRow},ext:{width:1000,height:700}}
    )

    // ══════════════════════════════════════════════════════════════════════════
    // SHEET C: รายชื่อผู้ประเมิน
    // ══════════════════════════════════════════════════════════════════════════
    const userSheet=wb.addWorksheet('รายชื่อผู้ประเมิน')
    userSheet.columns=[
      {key:'index',   width:30},
      {key:'name',    width:40},
      {key:'email',   width:42},
      {key:'company', width:32},
      {key:'position',width:32},
      {key:'status',  width:22},
    ]

    userSheet.mergeCells('A1:F1')
    Object.assign(userSheet.getCell('A1'),{
      value:`รายชื่อผู้ประเมิน & สรุปสถานะ — Safety Culture Survey ปี ${currentYear}`,
      font:{bold:true,size:13,name:'Calibri',color:{argb:'FFFFFFFF'}},
      fill:{type:'pattern',pattern:'solid',fgColor:{argb:'FF06202B'}},
      alignment:{horizontal:'center',vertical:'middle'}
    })
    userSheet.getRow(1).height=34
    userSheet.addRow([])

    const total   = users.length
    const done    = completionStatus.filter(u=>u.status==='done').length
    const pending = total-done
    const pctDone = total>0?((done/total)*100).toFixed(1):'0.0'

    const kpiRow=userSheet.getRow(3)
    ;[
      [`ผู้ประเมินทั้งหมด\n${total} คน`,'FF06202B'],
      [`ทำแล้ว\n${done} คน`,'FF1A6B1A'],
      [`ยังไม่ทำ\n${pending} คน`,'FFB22222'],
      [`% สำเร็จ\n${pctDone}%`,'FF856404'],
      ['','FFFFFFFF'],['','FFFFFFFF']
    ].forEach(([v,color],i)=>{
      const cell=kpiRow.getCell(i+1)
      cell.value=v; cell.font={bold:true,size:12,name:'Calibri',color:{argb:'FFFFFFFF'}}
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:color}}
      cell.alignment={horizontal:'center',vertical:'middle',wrapText:true}
      cell.border={top:{style:'medium',color:{argb:'FFFFFFFF'}},bottom:{style:'medium',color:{argb:'FFFFFFFF'}},left:{style:'medium',color:{argb:'FFFFFFFF'}},right:{style:'medium',color:{argb:'FFFFFFFF'}}}
    })
    kpiRow.height=44
    userSheet.addRow([])

    const cHeaderRow=userSheet.getRow(5)
    ;['ลำดับ','ชื่อ-นามสกุล','อีเมล','บริษัท','ตำแหน่ง','สถานะการประเมิน'].forEach((h,i)=>{
      const cell=cHeaderRow.getCell(i+1)
      cell.value=h; cell.font={bold:true,color:{argb:'FFFFFFFF'},name:'Calibri',size:11}
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF06202B'}}
      cell.alignment={vertical:'middle',horizontal:'center',wrapText:true}
      cell.border=headerBorder()
    })
    cHeaderRow.height=30

    users.forEach((u,idx)=>{
      const email   = u.email_user   || u.email    || ''
      const name    = `${u.title_user||''}${u.name_user||u.name||''}`.trim()
      const company = u.company_user  || u.company  || '-'
      const pos     = u.position_user || u.position || '-'
      const status  = statusMap[email] || 'ยังไม่ทำ'
      const isDone  = status==='ทำแล้ว'
      const rowNum  = idx+6
      const row     = userSheet.getRow(rowNum)
      const bgBase  = idx%2===0?'FFFFFFFF':'FFF7F9FC'

      ;[idx+1,name,email,company,pos,status].forEach((v,i)=>{
        const cell=row.getCell(i+1)
        cell.value=v
        cell.font={name:'Calibri',size:11,...(i===5?{bold:true,color:{argb:isDone?'FF1A6B1A':'FFB22222'}}:{})}
        cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:i===5?(isDone?'FFE8F5E9':'FFFCE4E4'):bgBase}}
        // ✅ wrapText เปิดทุก text col
        cell.alignment={vertical:'middle',horizontal:i===0||i===5?'center':'left',wrapText:i>=1&&i<=4}
        cell.border=thinBorder('FFEEEEEE')
      })

      // ✅ Dynamic height — ครอบคลุม email และ position ยาว
      row.height = calcRowHeightFromCells([
        { text: name,    colWidth: 40 },
        { text: email,   colWidth: 42 },
        { text: company, colWidth: 32 },
        { text: pos,     colWidth: 32 },
      ], 22)
    })

    // Company summary
    const userTableEnd   = users.length+7
    const summarySection = userTableEnd+2
    addSectionTitle(userSheet,summarySection,`  สรุปสถานะการทำแบบประเมิน แยกตามบริษัท  ปี ${currentYear}`,6)
    userSheet.getRow(summarySection).height=30

    const sumHeaderRow=summarySection+1
    ;['บริษัท','ทำแล้ว (คน)','ยังไม่ทำ (คน)','รวม (คน)','% สำเร็จ','สถานะ'].forEach((h,i)=>{
      const cell=userSheet.getCell(sumHeaderRow,i+1)
      cell.value=h; cell.font={bold:true,color:{argb:'FFFFFFFF'},name:'Calibri',size:11}
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF1A3C50'}}
      cell.alignment={vertical:'middle',horizontal:'center',wrapText:true}
      cell.border=headerBorder()
    })
    userSheet.getRow(sumHeaderRow).height=30

    companyNames.forEach((company,ci)=>{
      const {done:d,pending:p}=companyStats[company]
      const tot=d+p
      const pct=tot>0?parseFloat(((d/tot)*100).toFixed(1)):0
      const statusLabel=pct>=80?'✅ เสร็จสิ้น':pct>=50?'⏳ กำลังดำเนินการ':'⚠️ ต้องเร่งดำเนินการ'
      const statusArgb =pct>=80?'FF1A6B1A':pct>=50?'FF856404':'FF991B1B'
      const rowNum=sumHeaderRow+1+ci
      const dataRow=userSheet.getRow(rowNum)
      const bgBase=ci%2===0?'FFFFFFFF':'FFF5FFFE'

      ;[company,d,p,tot,pct,statusLabel].forEach((v,vi)=>{
        const cell=dataRow.getCell(vi+1)
        cell.value=v
        cell.font={name:'Calibri',size:11,...(vi===5?{bold:true,color:{argb:statusArgb}}:{})}
        cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:bgBase}}
        cell.alignment={vertical:'middle',horizontal:vi===0?'left':'center',wrapText:vi===0}
        cell.border=thinBorder()
        if(vi===4) cell.numFmt='0.0"%"'
      })

      // ✅ Dynamic height สำหรับชื่อบริษัทที่ยาว
      dataRow.height = calcRowHeightFromCells([
        { text: company, colWidth: 32 }
      ], 24)
    })

    // Grand total
    const grandTotal=companyNames.reduce((s,n)=>s+companyStats[n].done+companyStats[n].pending,0)
    const grandDone =companyNames.reduce((s,n)=>s+companyStats[n].done,0)
    const grandPend =companyNames.reduce((s,n)=>s+companyStats[n].pending,0)
    const grandPct  =grandTotal>0?parseFloat(((grandDone/grandTotal)*100).toFixed(1)):0
    const totRowNum =sumHeaderRow+1+companyNames.length
    const totRow    =userSheet.getRow(totRowNum)
    ;['รวมทั้งหมด',grandDone,grandPend,grandTotal,grandPct,''].forEach((v,vi)=>{
      const cell=totRow.getCell(vi+1)
      cell.value=v
      cell.font={bold:true,name:'Calibri',size:11}
      cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFFFE0B2'}}
      cell.alignment={vertical:'middle',horizontal:vi===0?'left':'center'}
      cell.border={top:{style:'medium',color:{argb:'FF06202B'}},bottom:{style:'medium',color:{argb:'FF06202B'}},left:thinBorder('FFAAAAAA').left,right:thinBorder('FFAAAAAA').right}
      if(vi===4) cell.numFmt='0.0"%"'
    })
    totRow.height=28

    // Chart C
    const chartSection=totRowNum+2
    addSectionTitle(userSheet,chartSection,`  กราฟสถานะการทำแบบประเมิน แยกตามบริษัท (ปี ${currentYear})`,6)
    const cChartDescRow=chartSection+1
    addChartDescription(userSheet,cChartDescRow,
      '📊 Stacked Bar แนวนอนแสดงจำนวนผู้ประเมินแต่ละบริษัท  ■ เข้ม = ทำแล้ว  ■ แดง = ยังไม่ทำ  ความยาวรวม = จำนวนทั้งหมดในบริษัทนั้น  บริษัทที่แท่งแดงยาวกว่า = ต้อง follow-up ด่วน',
      6,'FFEBF5FB')
    const imgHeightPx=Math.min(700,Math.max(300,companyNames.length*55+160))
    userSheet.addImage(
      wb.addImage({base64:imgCompanyBar,extension:'png'}),
      {tl:{col:0,row:cChartDescRow},ext:{width:1100,height:imgHeightPx}}
    )

    // Save
    const buffer=await wb.xlsx.writeBuffer()
    saveAs(
      new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),
      `Safety_Culture_Report_${currentYear}_${new Date().toISOString().split('T')[0]}.xlsx`
    )

  } catch(err){
    console.error('Error generating Excel:',err)
    alert('เกิดข้อผิดพลาดในการสร้างไฟล์ Excel กรุณาลองใหม่อีกครั้ง')
  } finally {
    isGenerating.value=false
  }
}
</script>

<style scoped>
/* No extra styles needed */
</style>