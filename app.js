var fdb = new ForerunnerDB();
var db = fdb.db("DB");
var tdCollection = db.collection("td");
var iss = true;
$('body').hide();
$('#myModal').hide();
var loadDate = new Date();
var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
for(let i=0; i<10;i++){
  $("#year, #year1").append('<option value='+(loadDate.getFullYear()+i)+'>'+(loadDate.getFullYear()+i)+"</option>");
}
for(let i=0; i<12; i++){
  $("#month, #month1").append('<option value='+i+'>'+month[i]+'</option>');
}
for(let i=0; i<24; i++){
  $("#hour, #hour1").append('<option value='+i+'>'+i+'</option>');
}
for(let i=0; i<60; i++){
  $("#minute, #minute1").append('<option value='+i+'>'+i+'</option>');
}

window.ElectionAPI.prepareToClose((event)=>{

});

tdCollection.load(function(){//TODO:Expired item won't change to "expire style" until reload the page
  //window.electronAPI.pushToBackend("aaa")
  if(tdCollection.find().length != 0){
    for(var i = 0; i < tdCollection.find().length; i++){
      var td = tdCollection.find();
      $('#todo-list').append(template(td[i].val, td[i].com, td[i]._id,td[i].dl));
      tdCollection.save();
      var tg = $('.toggle').get(i);
      if(!$(tg).prop("checked")){
        iss = false;
      }
    }
  }else{
    iss = false;
  }
            
  $('#toggle-all').prop('checked', iss);
	count();
  $('body').show();
  var ENTER_KEY = 13;
  
  function template(val, com, id, dl){//TODO: modify the template to show deadline
    if(com){//completed
      return '<li class="completed" data-id=' + id + '><div class="view"><input class="toggle" type="checkbox" checked=true><label>' + val + '</label>'+'<b class="time">'+'expires at: '+((dl == "false")?("None"):(dl))+'</b><btn class="btn btn-info">edit</btn><button class="destroy"></button></div></li>';
    }else if(dl != "false"){
      let nowTime = new Date();
      let deadLine = new Date(dl);
      if (nowTime-deadLine > 0){//expired
        return '<li class="expired" data-id=' + id + '><div class="view div"><input class="toggle" type="checkbox"><label>' + val + '</label>'+'<b class="time">'+'expires at: '+((dl == "false")?("None"):(dl))+'</b>'+'<btn class="btn btn-info">edit</btn><button class="destroy"></button></div></li>'
      }else{//not expired
        return '<li data-id=' + id + '><div class="view div"><input class="toggle" type="checkbox"><label>' + val + '</label>'+'<b class="time">'+'expires at: '+((dl == "false")?("None"):(dl))+'</b><btn class="btn btn-info">edit</btn><button class="destroy"></button></div></li>';
      }
      
    }else{//no deadline
      return '<li data-id=' + id + '><div class="view div"><input class="toggle" type="checkbox"><label>' + val + '</label>'+'<b class="time">'+'expires at: '+((dl == "false")?("None"):(dl))+'</b><btn class="btn btn-info">edit</btn><button class="destroy"></button></div></li>'
    }
  }

  function count(){
    var left = $('#todo-list li').length - $('#todo-list li.completed').length;
    $('strong').text(left);
	  if(left == 0){
	  	$('#toggle-all').prop('checked', true);
	  }else if(left >=0){
	  	$('#toggle-all').prop('checked', false);
	  }
  }

  $('#new-todo').on('keydown', function(e){//輸入一
    if (e.which == ENTER_KEY){
      let val = $(this).val();
      let nowDate = new Date();
      let deadLine
      if(Number($("#year").val()) != -1 && Number($("#month").val()) != -1 && Number($("#date").val()) != -1 && Number($("#hour").val()) != -1 && Number($("#minute").val()) != -1){
        deadLine = new Date(Number($("#year").val()), Number($("#month").val()), Number($("#date").val()), Number($("#hour").val()), Number($("#minute").val()),0);
      }else{
        deadLine = false; // without expire date
      }
      if(val == ""){
        alert("Please enter a event title!");
        return;
      }
      if (typeof deadLine != "boolean" && nowDate-deadLine > 0){
        alert("Wrong input: Deadline time is before current time.");
        return;
      }

      var filter0 = /.+/;
      var filter1 = true;
      if(val[0] == " " || val[val.length-1] == " "){
        filter1 = false;
      }
      if(filter0.test(val) && filter1){
		    tdCollection.insert({val:val, com:false, dl: deadLine.toString()});
        $('#todo-list').append(template(val, false, tdCollection.find()[tdCollection.find().length-1]._id, deadLine.toString()));
        tdCollection.save();
        $(this).val('');
        count();
      }
    }
  });

  $("#date").on("click", function(){
    let nextMonth = Number($("#month").val())+1;
    let thisYear = Number($("#year").val());
    $("#date option").remove();
    $("#date").append('<option value="-1" >Date</option>');
    if(nextMonth == 0){
      return;
    }else{
      let maxDate = new Date(thisYear, nextMonth, 0);
      for (let i=1; i<=maxDate.getDate();i++){
        $("#date").append('<option value='+i+'>'+i+'</option>');
      }
    }
  });

  $("#date1").on("click", function(){
    let nextMonth = Number($("#month1").val())+1;
    let thisYear = Number($("#year1").val());
    $("#date1 option").remove();
    $("#date1").append('<option value="-1" >Date</option>');
    if(nextMonth == 0){
      return;
    }else{
      let maxDate = new Date(thisYear, nextMonth, 0);
      for (let i=1; i<=maxDate.getDate();i++){
        $("#date1").append('<option value='+i+'>'+i+'</option>');
      }
    }
  });
	
  $('btn1').on('click', function(){//輸入一
    //TODO: for unknown reason, if you edit something when it's completed, the font won't change to normal until reload the page
      let val = $('#new-todo').val();
      let nowDate = new Date();
      let deadLine;
      if(Number($("#year").val()) != -1 && Number($("#month").val()) != -1 && Number($("#date").val()) != -1 && Number($("#hour").val()) != -1 && Number($("#minute").val()) != -1){
        deadLine = new Date(Number($("#year").val()), Number($("#month").val()), Number($("#date").val()), Number($("#hour").val()), Number($("#minute").val()),0);
      }else{
        deadLine = false; // without expire date
      }
      if(val == ""){
        alert("Please enter a event title!");
        return;
      }
      if (typeof deadLine != "boolean" && nowDate-deadLine > 0){
        alert("Wrong input: Deadline time is before current time.");
        return;
      }
      var filter0 = /.+/;
      var filter1 = true;
      if(val[0] == " " || val[val.length-1] == " "){
        filter1 = false;
      }
      if(filter0.test(val) && filter1){
        tdCollection.insert({val:val, com:false, dl: deadLine.toString()});
        $('#todo-list').append(template(val, false, tdCollection.find()[tdCollection.find().length-1]._id, deadLine.toString()));
        tdCollection.save();
        $('#new-todo').val('');
        count();
      }
  });

  $('#todo-list').on('click', 'button', function(){//delete
    $(this).closest('li').remove();
    var id = jQuery(this).closest('li').data('id');
    tdCollection.removeById(id);
    tdCollection.save();
    count();
  });

  $('#todo-list').on('click', 'input', function(){//complete
    $(this).closest('li').toggleClass('completed');
    var li = $(this).closest('li');
    var la = $(this).closest('lable');
    var id = jQuery(this).closest(li).data('id');
    if ( $( this ).is( ":checked" ) ){
      tdCollection.updateById(id, {_id: id, com:true});
    }else{
      tdCollection.updateById(id, {_id: id, com:false});
    }
    tdCollection.save();
    count();
  });

  $('#clear-completed').on('click', function(){
    var time = $('li.completed').length
    for(var i = 0; i<=time; i++){
      var id = jQuery('li.completed').first().data('id');
      tdCollection.removeById(id);
      tdCollection.save();
      $('li.completed').first().remove();
    }
    $('#toggle-all').prop('checked', false);
    tdCollection.save();
    count();
  });

  $('#toggle-all').on('click', function(){
    var todos = $('#todo-list li');
    if (this.checked){
      todos.addClass('completed');
      todos.find('input').prop('checked', true);
      for(var i = 0; i<=todos.find('input').length; i++){
        var elem = $('li').get(i);
        var id = jQuery(elem).data('id');
        tdCollection.updateById(id, {_id: id, com:true});
        tdCollection.save();
      }
      tdCollection.save();
    }else {
      todos.removeClass('completed');
      todos.find('input').prop('checked', false);
      for(var _i = 0; _i<=todos.find('input').length; _i++){
        var _elem = $('li').get(_i);
        var _id = jQuery(_elem).data('id');
        tdCollection.updateById(_id, {_id: _id, com:false});
        tdCollection.save();
      }
      tdCollection.save();
    }
    count();
  });

  $('#filters').on('click', 'a', function(){
    //TODO: checked item won't disappear immediately
    var $this = $(this);
    var todos = $('#todo-list li');
  
    $('#filters').find('a').removeClass('selected');
    $this.addClass('selected');
  
    if ($this.data('choice') == 'all'){
      todos.show();
    }
    else if ($this.data('choice') == 'active'){
      todos.hide();
      todos.not('.completed').show();
    }
    else if ($this.data('choice') == 'completed'){
      todos.hide();
      $('.completed').show();
    }
    count();
    });

  $('body').on('click', 'label', function(){
    var li = $(this).closest('li');
    var thiss = $(this);
    li.find('input').click();
  });
  
  $('body').on('click', 'btn', function(){//edit
    var li = $(this).closest('li');
    var id = jQuery(this).closest('li').data('id');
    li.addClass('on');
    $('p1').html('<p data-id=' + id + '></p>')
    $('p').text('Edit "' + li.find('label').text() + '" to:');
    $('#myModal').modal();
  });
  
  $('.btn-primary').click(function(){//TODO:edit "save"
    let id = $('p').data("id");
    let val = $('#ip').val()
    let deadLine;
    let nowDate = new Date()
    if(Number($("#year1").val()) != -1 && Number($("#month1").val()) != -1 && Number($("#date1").val()) != -1 && Number($("#hour1").val()) != -1 && Number($("#minute1").val()) != -1){
      deadLine = new Date(Number($("#year1").val()), Number($("#month1").val()), Number($("#date1").val()), Number($("#hour1").val()), Number($("#minute1").val()),0);
    }else{
      deadLine = false; // without expire date
    }
    if(val == ""){
      alert("Please enter a event title!");
      return;
    }
    if (typeof deadLine != "boolean" && nowDate-deadLine > 0){
      alert("Wrong input: Deadline time is before current time.");
      return;
    }
    tdCollection.updateById(id, {_id: id, val:val, dl:deadLine.toString()});
    if(tdCollection.findById(id,undefined).com){
      $('.on').html(template(val, true, tdCollection.find()[tdCollection.find().length-1]._id, deadLine.toString()));
    }else{
      $('.on').html(template(val, false, tdCollection.find()[tdCollection.find().length-1]._id, deadLine.toString()));
    }
    $('.on').removeClass('on');
    $('#ip').val('');
    tdCollection.save();
  });
  
  $('.btn-default').click(function(){//turn off modal "cancel"
    $('.on').removeClass('on');
    $('#ip').val('');
  });

});
