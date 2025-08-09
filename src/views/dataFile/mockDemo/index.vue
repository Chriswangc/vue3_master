<template>
  <!--
    @file 数据列表示例页面
    @description 展示数据表格、折线图、饼图，并支持数据详情查看和删除等操作
  -->
  <div class="mock-demo-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>数据列表示例</span>
          <el-button type="primary" @click="refreshData">刷新数据</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading.table">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row.id)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <div class="chart-container">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>折线图示例</span>
          </div>
        </template>
        <div class="chart" ref="lineChartRef" v-loading="loading.lineChart"></div>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>饼图示例</span>
          </div>
        </template>
        <div class="chart" ref="pieChartRef" v-loading="loading.pieChart"></div>
      </el-card>
    </div>

    <el-dialog v-model="dialogVisible" title="数据详情" width="30%">
      <div v-if="detailData">
        <p><strong>ID:</strong> {{ detailData.id }}</p>
        <p><strong>名称:</strong> {{ detailData.name }}</p>
        <p><strong>分类:</strong> {{ detailData.category }}</p>
        <p><strong>日期:</strong> {{ detailData.date }}</p>
        <p><strong>价格:</strong> {{ detailData.price }}</p>
        <p><strong>状态:</strong> {{ detailData.status ? '启用' : '禁用' }}</p>
        <p><strong>描述:</strong> {{ detailData.description }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * @file 数据列表示例页面
 * @description 展示数据表格、折线图、饼图，并支持数据详情查看和删除等操作
 */
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as echarts from 'echarts';
import { getDataList, getDataDetail, getLineChartData, getPieChartData } from '../../../api/data';

/**
 * @description 表格数据
 */
const tableData = ref([]);
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const total = ref(0); // 总条数

/**
 * @description 加载状态集合
 */
const loading = reactive({
  table: false,      // 表格加载
  lineChart: false,  // 折线图加载
  pieChart: false,   // 饼图加载
  detail: false      // 详情加载
});

// 图表实例和DOM引用
let lineChart = null; // 折线图实例
let pieChart = null;  // 饼图实例
const lineChartRef = ref(null); // 折线图DOM
const pieChartRef = ref(null);  // 饼图DOM

/**
 * @description 详情弹窗显示与数据
 */
const dialogVisible = ref(false); // 详情弹窗显示状态
const detailData = ref(null);     // 详情数据

/**
 * @function fetchData
 * @description 获取数据列表并更新表格
 * @async
 */
const fetchData = async () => {
  loading.table = true;
  try {
    const res = await getDataList({
      page: currentPage.value,
      pageSize: pageSize.value
    });
    if (res.code === 200) {
      tableData.value = res.data.list;
      total.value = res.data.total;
    } else {
      console.error('获取数据列表失败:', res.message);
      ElMessage.error(res.message || '获取数据列表失败');
    }
  } catch (error) {
    console.error('获取数据列表失败:', error);
    ElMessage.error('获取数据列表失败');
  } finally {
    loading.table = false;
  }
};

/**
 * @function refreshData
 * @description 刷新表格和图表数据
 */
const refreshData = () => {
  fetchData();
  initLineChart();
  initPieChart();
};

/**
 * @function viewDetail
 * @description 查看数据详情，弹窗展示
 * @param {number} id - 数据ID
 * @async
 */
const viewDetail = async (id) => {
  loading.detail = true;
  try {
    const res = await getDataDetail(id);
    if (res.code === 200) {
      detailData.value = res.data;
      dialogVisible.value = true;
    }
  } catch (error) {
    console.error('获取数据详情失败:', error);
    ElMessage.error('获取数据详情失败');
  } finally {
    loading.detail = false;
  }
};

/**
 * @function deleteItem
 * @description 删除数据项，弹窗确认
 * @param {number} id - 数据ID
 */
const deleteItem = (id) => {
  ElMessageBox.confirm('确定要删除该数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 模拟删除操作
    ElMessage.success('删除成功');
    fetchData();
  }).catch(() => {
    // 取消删除
  });
};

/**
 * @function initLineChart
 * @description 初始化并渲染折线图
 * @async
 */
const initLineChart = async () => {
  loading.lineChart = true;
  try {
    if (!lineChartRef.value) {
      console.warn('折线图DOM元素未找到');
      return;
    }
    if (!lineChart) {
      lineChart = echarts.init(lineChartRef.value, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
    }
    const res = await getLineChartData();
    if (res.code === 200) {
      const { xAxis, series } = res.data;
      const option = {
        title: {
          text: '数据趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
        },
        yAxis: {
          type: 'value'
        },
        series: series.map(item => ({
          name: item.name,
          type: 'line',
          stack: '总量',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(128, 255, 165)'
            }, {
              offset: 1,
              color: 'rgb(1, 191, 236)'
            }])
          },
          emphasis: {
            focus: 'series'
          },
          data: item.data
        })),
      };
      lineChart.setOption(option);
      window.addEventListener('resize', lineChart.resize);
    } else {
      console.error('获取折线图数据失败:', res.message);
      ElMessage.error(res.message || '获取折线图数据失败');
    }
  } catch (error) {
    console.error('初始化折线图失败:', error);
    ElMessage.error('初始化折线图失败');
  } finally {
    loading.lineChart = false;
  }
};

/**
 * @function initPieChart
 * @description 初始化并渲染饼图
 * @async
 */
const initPieChart = async () => {
  loading.pieChart = true;
  try {
    if (!pieChartRef.value) {
      console.warn('饼图DOM元素未找到');
      return;
    }
    if (!pieChart) {
      pieChart = echarts.init(pieChartRef.value, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
    }
    const res = await getPieChartData();
    if (res.code === 200) {
      const option = {
        title: {
          text: '数据分布',
          left: 'center',
          top: 0
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(50,50,50,0.7)',
          borderColor: '#333',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          orient: 'vertical',
          left: '5%',
          top: 'middle',
          itemWidth: 10,
          itemHeight: 10,
          data: res.data.map(item => item.name),
        },
        series: [
          {
            name: '数据分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: res.data.map(item => ({
              ...item,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: echarts.color.lift(item.color || '#5470c6', 0.1)
                }, {
                  offset: 1,
                  color: echarts.color.lift(item.color || '#5470c6', -0.1)
                }])
              }
            }))
          }
        ]
      };
      pieChart.setOption(option);
      window.addEventListener('resize', pieChart.resize);
    } else {
      console.error('获取饼图数据失败:', res.message);
      ElMessage.error(res.message || '获取饼图数据失败');
    }
  } catch (error) {
    console.error('初始化饼图失败:', error);
    ElMessage.error('初始化饼图失败');
  } finally {
    loading.pieChart = false;
  }
};

/**
 * @function handleCurrentChange
 * @description 处理页码变化
 * @param {number} val - 新的页码
 */
const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchData();
};

/**
 * @function handleSizeChange
 * @description 处理每页条数变化
 * @param {number} val - 新的每页条数
 */
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchData();
};

/**
 * @lifecycle onUnmounted
 * @description 组件卸载时，移除事件监听和销毁图表实例
 */
onUnmounted(() => {
  window.removeEventListener('resize', lineChart?.resize);
  window.removeEventListener('resize', pieChart?.resize);
  if (lineChart) {
    lineChart.dispose();
    lineChart = null;
  }
  if (pieChart) {
    pieChart.dispose();
    pieChart = null;
  }
});

/**
 * @lifecycle onMounted
 * @description 组件挂载时，初始化数据和图表
 */
onMounted(() => {
  fetchData();
  setTimeout(() => {
    initLineChart();
    initPieChart();
  }, 100);
});
</script>

<style scoped>
.mock-demo-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  display: flex;
  margin-top: 20px;
  gap: 20px;
}

.chart-container .box-card {
  flex: 1;
}

.chart {
  height: 400px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>