(async () => {//init
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

  function template(val, com, id, dl){
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

  //load page
  var todoList = await window.electronAPI.loadFile()
  // todoList = []
  // var d = window.electronAPI.loadFile() // same here
  // var todoList = JSON.parse(d)
  console.log(todoList);
  var lastid = 0;
  if(todoList.length > 0 ) lastid = todoList[todoList.length-1].id + 1;//Last id as identifier
  console.log(lastid)

  if(todoList.length != 0){
    for(let i=0; i<todoList.length; i++){
      $('#todo-list').append(template(todoList[i].val, todoList[i].com, todoList[i].id, todoList[i].dl));
      let tg = $('.toggle').get(i);
      if(!$(tg).prop("checked")){
        iss = false;
      }
    }
  }else iss = false;

  $('#toggle-all').prop('checked', iss);
  count();
  $('body').show();
  var ENTER_KEY = 13;

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

  $('#new-todo').on('keydown', function(e){//e: pressed key
    if(e.which == ENTER_KEY){
      let val = $(this).val();
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

      let filter0 = /.+/;
      let filter1 = true;
      if(val[0] == " " || val[val.length-1] == " "){
        filter1 = false;
      }
      if(filter0.test(val) && filter1){
        todoList.push({val:val, com:false, dl: deadLine.toString(), id: lastid});//TODO:what is id for?
        $('#todo-list').append(template(val, false, todoList[todoList.length-1].id, deadLine.toString()));
        window.electronAPI.updateFile(JSON.stringify(todoList))
        $(this).val('');
        count();
        lastid++;
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
      let filter0 = /.+/;
      let filter1 = true;
      if(val[0] == " " || val[val.length-1] == " "){
        filter1 = false;
      }
      if(filter0.test(val) && filter1){
        todoList.push({val:val, com:false, dl: deadLine.toString(), id:lastid});
        $('#todo-list').append(template(val, false, todoList[todoList.length-1].id, deadLine.toString()));
        window.electronAPI.updateFile(JSON.stringify(todoList))
        $('#new-todo').val('');
        count();
        lastid++;
      }
  });

  //array.prototype.splice(index,1)
  //index: pos of item to remove
  $('#todo-list').on('click', 'button', function(){//delete
    let id = jQuery(this).closest('li').data('id');    
    $(this).closest('li').remove();
    //console.log(id)
    todoList.splice(todoList.findIndex((element) => element.id == id),1); //TODO:Sometimes Fail to delete item because id-index disagreement
    window.electronAPI.updateFile(JSON.stringify(todoList))  //tdCollection.save();  
    count();
    if(todoList.length > 0 ) lastid = todoList[todoList.length-1].id + 1;
    else lastid = 0;
  });

  $('#todo-list').on('click', 'input', function(){//complete
    $(this).closest('li').toggleClass('completed');
    let li = $(this).closest('li');
    let id = jQuery(this).closest(li).data('id');
    if ( $( this ).is( ":checked" ) ){//TODO:Sometimes Fail to delete item because id-index disagreement
      todoList[todoList.findIndex((element) => element.id == id)].com = true;//tdCollection.updateById(id, {id: id, com:true});
    }else{
      todoList[todoList.findIndex((element) => element.id == id)].com = false;//tdCollection.updateById(id, {id: id, com:false});
    }
    window.electronAPI.updateFile(JSON.stringify(todoList))//tdCollection.save();
    count();
  });

  $('#clear-completed').on('click', function(){
    let time = $('li.completed').length
    for(let i = 0; i<=time; i++){
      let id = jQuery('li.completed').first().data('id');
      todoList.splice(todoList.findIndex((element) => element.id == id),1);//TODO:tdCollection.removeById(id);
      window.electronAPI.updateFile(JSON.stringify(todoList))//tdCollection.save();
      $('li.completed').first().remove();
    }
    $('#toggle-all').prop('checked', false);
    window.electronAPI.updateFile(JSON.stringify(todoList))//tdCollection.save();
    count();
  });

  $('#toggle-all').on('click', function(){
    let todos = $('#todo-list li');
    if (this.checked){
      todos.addClass('completed');
      todos.find('input').prop('checked', true);
      for(let i = 0; i<=todos.find('input').length; i++){
        let elem = $('li').get(i);
        let id = jQuery(elem).data('id');
        todoList[todoList.findIndex((element) => element.id == id)].com = true;//tdCollection.updateById(id, {id: id, com:true});
        window.electronAPI.updateFile(JSON.stringify(todoList))//tdCollection.save();
      }
      window.electronAPI.updateFile(JSON.stringify(todoList))//tdCollection.save();
    }else {
      todos.removeClass('completed');
      todos.find('input').prop('checked', false);
      for(let _i = 0; _i<=todos.find('input').length; _i++){
        let _elem = $('li').get(_i);
        let id = jQuery(_elem).data('id');
        todoList[todoList.findIndex((element) => element.id == id)].com = true;//tdCollection.updateById(id, {id: id, com:false});
        window.electronAPI.updateFile(JSON.stringify(todoList))//tdCollection.save();
      }
      window.electronAPI.updateFile(JSON.stringify(todoList))//tdCollection.save();
    }
    count();
  });

  $('#filters').on('click', 'a', function(){
    //TODO: checked item won't disappear immediately
    //TODO: filter for expired items
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
    else if ($this.data('choice') == 'expired'){
      todos.hide();
      $('.expired').show();
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

  $('.btn-primary').click(function(){//edit "save"
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
    let pos = todoList.findIndex((element) => element.id == id)
    //TODO:tdCollection.updateById(id, {id: id, val:val, dl:deadLine.toString()});
    todoList[pos].id = id;
    todoList[pos].val = val;
    todoList[pos].dl = deadLine.toString()

    if(todoList[pos].com){//tdCollection.findById(id,undefined).com
      //$('.on').html(template(val, true, tdCollection.find()[tdCollection.find().length-1].id, deadLine.toString()));
      $('.on').html(template(val, true, todoList[todoList.length-1].id, deadLine.toString()));
    }else{
      //$('.on').html(template(val, false, tdCollection.find()[tdCollection.find().length-1].id, deadLine.toString()));
      $('.on').html(template(val, false, todoList[todoList.length-1].id, deadLine.toString()));
    }
    $('.on').removeClass('on');
    $('#ip').val('');
    window.electronAPI.updateFile(JSON.stringify(todoList))//TODO:renderer.js:297 Uncaught Error: An object could not be cloned.
  });

  $('.btn-default').click(function(){//turn off modal "cancel"
    $('.on').removeClass('on');
    $('#ip').val('');
  });
  var notified = []
  timer();
  function timer(){
    let time = new Date();
      todoList.forEach(element => {
        if(element.dl != 'false' && !element.com && !notified.includes(element.id)){
          a = new Date()
          b = new Date(element.dl)
          if(a-b >= 0){
            new Notification('Deadline Reached!', { body: 'Item '+ element.val+' has expired.'})
            notified.push(element.id)
          }
        }
      });
      setTimeout(() => {
          timer();
      }, 1000);
  }
})();
