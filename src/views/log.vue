<template>
  <!-- <div class="bg"></div> -->
  <el-scrollbar height="90vh" class="container">
    <el-timeline>

      <el-timeline-item timestamp="2023/10/9" placement="top">
        <el-card>
          <template #header>
            <div class="card-header">
              <h2>前后端重构部分代码,更好的体验</h2>
            </div>
          </template>
          <div class="log-detail">
            <h3><el-tag type="success">增</el-tag>新增功能 - 增加相册</h3>
            <ul>
              <li>可以创建和管理相册，以更好地组织和浏览图片。</li>
              <li>此功能支持将相册设置为公共或私有。</li>
            </ul>
          </div>
                    
          <div class="log-detail">
            <h3><el-tag type="success">增</el-tag>增加查看大图功能</h3>
            <ul>
              <li>点击图片即可查看图片信息和预览大图</li>
            </ul>
          </div>

          <div class="log-detail">
            <h3><el-tag type="success">增</el-tag>支持重置密码</h3>
            <ul>
              <li>通过忘记密码后的重置功能来恢复访问帐户。</li>
            </ul>
          </div>

          <div class="log-detail">
            <h3><el-tag type="success">增</el-tag>支持更换邮箱</h3>
            <ul>
              <li>更改注册邮箱地址</li>
            </ul>
          </div>

          <div class="log-detail">
            <h3><el-tag type="success">增</el-tag>增加第三方云存储</h3>
            <ul>
              <li>增加 <strong>backblaze</strong> 存储桶</li>
            </ul>
          </div>

          <div class="log-detail">
            <h3><el-tag type="danger">删</el-tag>不再支持图片重命名</h3>
          </div>

          <p>更新于 2023/10/9</p>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="2023/9/6" placement="top">
        <el-card>
          <template #header>
            <div class="card-header">
              <h2>更改首页布局</h2>
            </div>
          </template>
          <div class="log-detail">
            <h3><el-tag type="success">增</el-tag>新增瀑布流布局</h3>
            <ul>
              <li>瀑布流展示图片,最大化空间利用,适应不同内容,更好的用户体验</li>
            </ul>
          </div>
          <div class="log-detail">
            <h3><el-tag type="success">增</el-tag>增加响应式布局</h3>
            <ul>
              <li>大部分页面增加响应式布局,适应不同屏幕尺寸,轻松访问网站内容</li>
            </ul>
          </div>
          <p>更新于 2023/9/6</p>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="2023/8/20" placement="top">
        <el-card>
          <template #header>
            <div class="card-header">
              <h2>前端页面构建完成</h2>
            </div>
          </template>
          <div class="log-detail">
            <h3><el-tag>😀</el-tag>项目开始使用</h3>
            <ul>
              <li>2023/8/1 - 2023/8/20 前端页面构建完成</li>
            </ul>
          </div>
          <p>更新于 2023/8/20</p>
        </el-card>
      </el-timeline-item>
      
      <el-timeline-item timestamp="2023/6/10" placement="top">
        <el-card>
          <template #header>
            <div class="card-header">
              <h2>后端构建完成</h2>
            </div>
          </template>
          <div class="log-detail">
            <h3><el-tag>😀</el-tag>项目接口测试</h3>
            <ul>
              <li>2023/5/30 - 2023/6/10 后端构建完成</li>
            </ul>
          </div>
          <p>更新于 2023/6/10</p>
        </el-card>
      </el-timeline-item>

    </el-timeline>
  </el-scrollbar>
</template>

<script setup></script>

<style lang="scss" scoped>
// .bg {
//   width: 100%;
//   height: 100%;
//   position: fixed; /* 让背景固定 */
//   top: 0;
//   left: 0;
//   z-index: -1; /* 将背景放在最底层，使内容可以覆盖它 */
//   background: url('../assets/bg/bg-7.jpg') no-repeat center/cover;
// }

.container {
  padding: 50px;
  box-sizing: border-box;
  position: fixed; /* 让背景固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/bg/bg-7.jpg') no-repeat center/cover;

  .log-detail {
    margin-bottom: 1em;

    ul {
      margin-left: 40px;
      margin-top: 10px;

      li {
        list-style: disc;
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
}
</style>
