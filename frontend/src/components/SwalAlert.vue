<template id="my-template">
  <div>
    <swal-title>
        Save changes to "Untitled 1" before closing?
    </swal-title>
    <swal-icon :type="swalIcon" color="yellow"></swal-icon>
    <swal-button type="confirm">
        Save As
    </swal-button>
    <swal-button type="cancel">
        Cancel
    </swal-button>
    <swal-button type="deny">
        Close without Saving
    </swal-button>
    <swal-param name="allowEscapeKey" value="false" />
    <swal-param
        name="customClass"
        value='{ "popup": "my-popup" }' />
    <swal-function-param
        name="didOpen"
        value="popup => console.log(popup)" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      icon : ""
    }
  },
  props : [
    {
      swaltitle : String,
      swalcancel : String,
      swalconfirm : String,
      swalIcon : String,

    }
  ],
  emits : [],
  created() {
    this.icon = 'success'
  }

}
</script>