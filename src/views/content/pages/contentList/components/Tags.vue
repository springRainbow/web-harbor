<!--
*
* 标签区域
*
-->
<template>
  <div class="tags">
    <el-form ref="form" :model="form" label-width="100px" label-position="left">
      <el-form-item label="内容分类：" required="">
        <div class="tags-category" v-for="item in configs.category" :key="item.alias">
          <el-select
            class="tags-select"
            v-model="categoryAll[item.alias]"
            :placeholder="item.tag_name"
            :class="{ active: currentCategoryId === categoryAll[item.alias] }"
            @change="setCurrentCategoryId(item.alias)"
          >
            <el-option :label="tag.tag_name" :value="tag.id" v-for="tag in item.child_tag" :key="tag.id"></el-option>
          </el-select>
        </div>
        <!-- <p class="tags-tips">（分类：指内容发布板块，单选）</p> -->
        <div
          style="background: rgba(0, 0, 0, 0.02); width: 640px; padding: 20px; margin-top: 12px"
          v-show="currentCategoryAlias !== 'ky_examination'"
        >
          <div v-for="item in ms_arr" :key="item" class="tags-school-major-all">
            <el-form-item v-if="item === 'M'" label="专业：" label-width="66px" required="">
              <el-radio-group v-model="form.major_type" v-show="!major_type_disabled">
                <el-radio :label="1">全部专业</el-radio>
                <el-radio :label="0">限定专业</el-radio>
              </el-radio-group>
              <div v-show="form.major_type === 0">
                <Major
                  v-if="!major_type_multiple"
                  :majors="majors"
                  ref="Major"
                  :majorId="major_id"
                  :majorNameList="majorNameList"
                ></Major>
                <MajorMultiple
                  v-if="major_type_multiple"
                  :majors="majors"
                  ref="MajorMultiple"
                  :majorId="major_id"
                  :majorNameList="majorNameList"
                ></MajorMultiple>
              </div>
            </el-form-item>
            <el-form-item v-if="item === 'S'" label="院校：" label-width="66px" required="" style="margin-bottom: 0">
              <el-radio-group v-model="form.school_type" v-show="!school_type_disabled">
                <el-radio :label="1">全部院校</el-radio>
                <el-radio :label="0">限定院校</el-radio>
              </el-radio-group>
              <div v-show="form.school_type === 0">
                <School
                  v-if="!school_type_multiple"
                  :schools="schools"
                  :allSchools="allSchools"
                  :schoolId="school_id"
                  ref="School"
                ></School>
                <SchoolMultiple
                  v-if="school_type_multiple"
                  :schools="schools"
                  :allSchools="allSchools"
                  :schoolId="school_id"
                  ref="SchoolMultiple"
                ></SchoolMultiple>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="届数/阶段：" required="">
        <el-radio-group v-model="form.stage_year_type">
          <el-radio :label="2">届数</el-radio>
          <el-radio :label="1">考研阶段</el-radio>
        </el-radio-group>
        <p></p>
        <el-checkbox-group v-model="form.year_tags" v-if="form.stage_year_type == 2">
          <el-checkbox :label="year.id" v-for="year in configs.year" :key="year.id">{{ year.tag_name }}届</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.stage_tags" v-if="form.stage_year_type == 1">
          <el-checkbox :label="stage.id" v-for="stage in configs.stage" :key="stage.id">{{
            stage.tag_name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="推荐标签：" style="margin-top: 6px">
        <p class="tags-tips">（选填项，不可超过5个，标注合适的标签，可以让内容被更多人发现哦！）</p>
        <div style="margin-top: 14px">
          <span
            class="qz-tags"
            :class="{ active: form.recommend_tags.indexOf(recommend.id) !== -1 }"
            v-for="recommend in configs.recommend"
            :key="recommend.id"
            @click="doSelectTag(recommend.id, form.recommend_tags, 'recommend_tags')"
            >{{ recommend.tag_name }}</span
          >
        </div>
      </el-form-item>
      <el-form-item label="自定义标签：">
        <p class="tags-tips" style="margin-top: 6px">
          （选填项，可添加标签库之外的标签来描述内容！一次性选择不超过3个）
        </p>
        <div style="margin-top: 14px">
          <span
            class="qz-tags"
            :class="{ active: form.custom_tags.indexOf(tag.id) !== -1 }"
            v-for="(tag, index) in tagList"
            :key="tag.id"
            @click="doSelectTag(tag.id, form.custom_tags)"
            >{{ tag.name }}

            <img
              class="delete-btn"
              src="~@//assets/tag_delete.png"
              alt=""
              style="width: 12px"
              @click.stop="removeTag(index)"
            />
          </span>
          <span v-if="tagList.length != 10">
            <span @click="createTagFun" v-if="!createTag">
              <img src="~@//assets/add-btn@2x.png" alt="" style="width: 20px; vertical-align: middle" />
              <span class="card-text">添加</span>
            </span>
            <el-input
              v-else
              v-model="tag"
              placeholder="请输入标签"
              style="width: 178px"
              maxlength="20"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
              ref="inputs"
            ></el-input>
          </span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import api from '../../../_api';
import SchoolMultiple from './schoolAndMajorComponents/SchoolMultiple';
import School from './schoolAndMajorComponents/School';
import Major from './schoolAndMajorComponents/Major';
import MajorMultiple from './schoolAndMajorComponents/MajorMultiple';

export default {
  name: 'Tags',
  components: {
    SchoolMultiple,
    School,
    Major,
    MajorMultiple
  },
  data() {
    return {
      ms_arr: ['S', 'M'], //产品要求专业和院校位置会变化
      form: {
        category: '',
        second_category: '',
        year_tags: [],
        year_type: 1,
        major_type: 1,
        school_type: 1,
        recommend_tags: [],
        stage_tags: [],
        custom_tags: [],
        stage_year_type: 0,
        major_id: [],
        school_id: []
      },
      major_type_disabled: false, //专业是不是disabled
      school_type_disabled: false, //学校是不是disabled
      major_type_multiple: true, //专业是不是多选
      school_type_multiple: true, //学校是不是多选
      categoryAll: {}, //分类ID（可能是一级也可能是二级）
      currentCategoryId: 0, //存放选中的Category
      currentCategoryAlias: '', //选中的分类别名
      tag: '', //自定义标签内容
      tagList: [], //最近使用自定义标签的列表
      createTag: false, //创建标签
      configs: {
        category: []
      },
      majors: [],
      schools: [], //经营范围的院校
      allSchools: [], //所有的院校
      major_id: [],
      school_id: [],
      majorNameList: [] //编辑时返回的已选择的专业信息
    };
  },
  props: {},
  created() {
    if (!(this.tagList.length && this.configs)) {
      this.getTags();
    }
    this.getSchoolMajor();
  },
  computed: {},
  watch: {},

  methods: {
    //获取标签
    async getTags() {
      let { status, result } = await api.getTagConfig();
      if (status == 200) {
        this.configs = result;
        this.configs.category.forEach((i) => {
          this.categoryAll[i.alias] = '';
        });
      }
      //自定义标签
      let res = await api.getTagsList({
        tenant_uuid: localStorage.getItem('HARBOR_ID'),
        _t: new Date().getTime()
      });
      if (res.status == 200) {
        this.tagList = res.result;
      }
    },

    async getSchoolMajor(n) {
      let { result } = await api.getSchoolMajor({});
      if (result.majors.length) {
        this.majors = result.majors;
      }
      if (result.schools.length) {
        this.schools = result.schools;
      } else {
        this.getAllSchools();
      }
    },
    async getAllSchools() {
      const res = await api.getCompSchool();
      this.allSchools = res.result;
    },
    doSelectTag(id, tags, name) {
      const index = tags.indexOf(id);
      if (index !== -1) {
        tags.splice(index, 1);
      } else {
        if (tags.length === 3 && name != 'recommend_tags') {
          this.$message.error('自定义标签一次性选择不超过3个');
          return;
        }
        if (tags.length === 5 && name == 'recommend_tags') {
          this.$message.error('推荐标签一次性选择不超过5个');
          return;
        }
        tags.push(id);
      }
    },
    //新增自定义标签
    async handleInputConfirm() {
      if (!this.tag) {
        this.createTag = false;
        return false;
      }
      const { result, status, message } = await api.saveCustomTag({
        tag_name: this.tag
      });
      if (status == 200) {
        let isExisting = this.tagList.some((item) => {
          return item.id === result.id;
        });
        if (!isExisting) {
          this.tagList.push({ id: result.id, name: result.tag_name });
          this.createTag = false;
          this.tag = '';
        } else {
          this.$message('标签已存在');
        }
      } else {
        this.$message.error(message);
        this.tag = '';
      }
    },
    createTagFun() {
      this.createTag = true;
      this.$nextTick(() => {
        //正确写法
        this.$refs.inputs.focus();
      });
    },
    removeTag(index) {
      this.tagList.splice(index, 1);
    },
    getAllTags(isDraft) {
      let form = JSON.parse(JSON.stringify(this.form));
      console.log('标签', form);
      if (!isDraft && !this.currentCategoryId) {
        this.$message.error('请选择分类');
        return false;
      }
      if (this.currentCategoryAlias == 'ky_experience') {
        form.major_id = this.$refs.Major[0].getMajorId();
        form.school_id = this.$refs.School[0].getSchoolId();
      } else if (this.currentCategoryAlias == 'ky_examination') {
        form.major_id = [];
        form.school_id = [];
      } else {
        form.major_id = this.$refs.MajorMultiple[0].getMajorId();
        form.school_id = this.$refs.SchoolMultiple[0].getSchoolId();
      }
      if (!isDraft && !form.school_type && !form.school_id.length) {
        this.$message.error('请选择院校');
        return false;
      }
      if (!isDraft && !form.major_type && !form.major_id.length) {
        this.$message.error('请选择专业');
        return false;
      }
      if (form.school_type) {
        form.school_id = [];
      }
      if (form.major_type) {
        form.major_id = [];
      }
      if (!isDraft && form.stage_year_type == 0) {
        this.$message.error('请选择届数/考研阶段');
        return false;
      }
      if (form.stage_year_type == 1) {
        //阶段必填，年份为空
        //届数类型: 0 默认 ; 1 不限定 ; 2 限定
        //阶段类型: 0 默认 ; 1 不限定 ; 2 限定
        form.stage_type = 2;
        form.year_type = 1;
        form.year_tags = [];
        if (!isDraft && !form.stage_tags.length) {
          this.$message.error('请选择考研阶段');
          return false;
        }
      } else {
        //年份必填，阶段为空
        form.stage_type = 1;
        form.year_type = 2;
        form.stage_tags = [];
        if (!isDraft && !form.year_tags.length) {
          this.$message.error('请选择届数');
          return false;
        }
      }
      delete form.stage_year_type;
      return { ...form, ...this.getCategoryInfo() };
    },
    async setAllTags(result) {
      let {
        category, //一级分类ID
        second_category,
        year_tags,
        year_type,
        major_type,
        school_type,
        recommend_tags,
        stage_tags,
        custom_tags,
        major_id,
        school_id,
        stage_type,
        majors
      } = result;
      this.form = Object.assign(this.form, {
        category, //一级分类ID
        second_category,
        year_tags,
        year_type,
        major_type,
        school_type,
        recommend_tags,
        stage_tags,
        custom_tags,
        stage_type
      });
      if (year_type == 2) {
        this.form.stage_year_type = 2;
      } else {
        this.form.stage_year_type = 1;
      }
      if (!(this.tagList.length && this.configs)) {
        await this.getTags();
      }

      this.$nextTick(() => {
        console.log(second_category, 'second_category');
        if (!second_category) {
          this.currentCategoryId = category;
          this.currentCategoryAlias = this.getCurrentCategoryAlias(category);
        } else {
          this.currentCategoryId = second_category;
          this.currentCategoryAlias = this.getCurrentCategoryAlias(category, second_category);
        }
        this.categoryAll[this.currentCategoryAlias] = this.currentCategoryId;
        // if (this.currentCategoryAlias == 'ky_experience') {
        //   console.log(this.$refs.Major,major_id)
        //     this.$refs.Major.setMajorId(major_id)
        //     this.$refs.School.setSchoolId(school_id)
        // } else {
        //     this.$refs.MajorMultiple.setMajorId(major_id)
        //     this.$refs.SchoolMultiple.setSchoolId(school_id)
        // }
        if (this.currentCategoryAlias === 'ky_experience') {
          this.major_type_multiple = false;
          this.school_type_multiple = false;
        } else {
          this.major_type_multiple = true;
          this.school_type_multiple = true;
        }
        this.major_id = major_id;
        this.school_id = school_id;
        switch (this.currentCategoryAlias) {
          case 'ky_consultation':
            this.major_type_disabled = false;
            this.school_type_disabled = true;
            break;

          case 'ky_examination':
            this.major_type_disabled = true;
            this.school_type_disabled = true;
            break;

          case 'ky_experience':
            this.major_type_disabled = true;
            this.school_type_disabled = true;
            break;

          case 'ky_professional':
            this.major_type_disabled = true;
            this.school_type_disabled = false;
            break;
        }
        this.majorNameList = majors;
      });
    },
    getCurrentCategoryAlias(category) {
      let alias = '';
      this.configs.category.forEach((i) => {
        if (i.id == category) {
          alias = i.alias;
        }
      });
      return alias;
    },
    setCurrentCategoryId(alias) {
      this.currentCategoryId = this.categoryAll[alias];
      Object.keys(this.categoryAll).forEach((key) => {
        if (key !== alias) this.categoryAll[key] = '';
      });

      this.currentCategoryAlias = alias;
      this.changeSchoolAndMajorStatus();

      if (this.currentCategoryAlias === 'ky_experience') {
        this.major_type_multiple = false;
        this.school_type_multiple = false;
      } else {
        this.major_type_multiple = true;
        this.school_type_multiple = true;
      }
      if (alias !== 'ky_professional') {
        this.ms_arr = ['S', 'M'];
      } else {
        this.ms_arr = ['M', 'S'];
      }
    },
    changeSchoolAndMajorStatus() {
      console.log(this.currentCategoryAlias);
      switch (this.currentCategoryAlias) {
        case 'ky_consultation':
          this.form.school_type = 0;
          this.form.major_type = 1;
          this.major_type_disabled = false;
          this.school_type_disabled = true;
          break;

        case 'ky_examination':
          this.form.school_type = 1;
          this.form.major_type = 1;
          this.major_type_disabled = true;
          this.school_type_disabled = true;
          break;

        case 'ky_experience':
          this.form.school_type = 0;
          this.form.major_type = 0;
          this.major_type_disabled = true;
          this.school_type_disabled = true;
          break;

        case 'ky_professional':
          this.form.school_type = 1;
          this.form.major_type = 0;
          this.major_type_disabled = true;
          this.school_type_disabled = false;
          break;
      }
    },
    getCategoryInfo() {
      //通过currentCategoryId获取一级分类ID和二级分类id
      console.log(this.currentCategoryId, this.categoryAll);
      if (this.currentCategoryId) {
        let c = this.categoryAll;
        let o = {};
        for (let item in c) {
          if (this.currentCategoryId == c[item]) {
            this.configs.category.forEach((i) => {
              if (i.alias == item) {
                if (i.id == this.currentCategoryId) {
                  o = {
                    category: this.currentCategoryId,
                    second_category: ''
                  };
                } else {
                  o = {
                    category: i.id,
                    second_category: this.currentCategoryId
                  };
                }
              }
            });
          }
        }
        return o;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tags {
  /deep/ .el-form-item__label {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.6);
  }

  .tags-category {
    display: inline-block;
  }
  .tags-select,
  .tags-style {
    width: 116px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    margin-right: 12px;
  }
  .tags-select.active {
    /deep/.el-input__inner {
      color: rgba(35, 213, 221, 1);
      background: rgba(234, 249, 251, 1);
      border: 1px solid rgba(35, 213, 221, 1);
    }
    /deep/.el-input__suffix .el-input__suffix-inner .el-select__caret {
      color: rgba(35, 213, 221, 1);
    }
  }
  .tags-school-major {
    width: 100%;
  }
  .tags-style {
    top: 2px;
    position: relative;
    &.active {
      border: 1px solid rgba(35, 213, 221, 1);
      color: rgba(35, 213, 221, 1);
      background: rgba(234, 249, 251, 1);
    }
  }

  .tags-tips {
    margin-top: 8px;
    height: 22px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
    line-height: 22px;
  }
}
.tags /deep/ .el-checkbox-group {
  display: inline;
}
.tags /deep/ .el-radio,
.tags /deep/ .el-checkbox {
  padding-left: 4px;
  margin-right: 16px;
}
.qz-tags {
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(204, 204, 204, 1);
  padding: 4px 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.79);
  margin-right: 12px;
  line-height: 22px;
  display: inline-block;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;
  &:hover,
  &.active {
    border: 1px solid rgba(25, 209, 220, 1);
    color: rgba(39, 215, 221, 1);
  }
  &.active {
    background-color: #e8fafc;
  }
  .delete-btn {
    display: none;
    position: absolute;
    right: -6px;
    top: -6px;
  }
  &:hover .delete-btn {
    display: inline-block;
  }
}

.card-text {
  cursor: pointer;
  display: inline-block;
  margin-left: 3px;
  margin-right: 30px;
  height: 22px;
  font-size: 14px;
  color: rgba(21, 207, 220, 1);
  line-height: 22px;
}
.tags-category ::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  color: #606266;
}

.tags-category :-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #606266;
}

.tags-category ::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #606266;
}

.tags-category :-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #606266;
}
.tags-category /deep/.el-input__inner {
  font-size: 14px;
  font-weight: bold;
  color: #606266;
  text-align: center;
}
.tags-school-major-all /deep/ .el-form-item--small.el-form-item {
  margin-bottom: 0 !important;
}
</style>
<style lang="css">
.majors-cascader .el-cascader-panel .el-cascader-menu:nth-child(-n + 2) .el-checkbox {
  display: none;
}
.school-cascader .el-cascader-panel .el-cascader-menu:nth-child(1) .el-checkbox {
  display: none;
}
</style>
