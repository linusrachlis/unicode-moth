var $man;
var manx = 500, many = 300;
// mousemove event handler will store coords here
var mouseX = manx, mouseY = many;
// the man will aim for these coordinates, which are chosen at a regular
// interval to be randomly in the cursor's vicinity.
var targetX = mouseX, targetY = mouseY; 
var moveMin = 1, moveMax = 6; // base range for all movement
var drunkenness = 1; // randomness factor (multiplies chance movement)
var eagerness = 2;   // cursor chase speed factor (multiplies main movement)
var momentumx = 0, momentumy = 0;
function step()
{
    // This adds chance to the movement
    var movex = (moveMin + (Math.random()*moveMax)) * drunkenness;
    var movey = (moveMin + (Math.random()*moveMax)) * drunkenness;
    // - randomise left/right and up/down too
    if (Math.round(Math.random())) movex *= -1;
    if (Math.round(Math.random())) movey *= -1;
    // Add the chance movement _and_ the momentum to the working new position.
    manx += movex + momentumx;
    many += movey + momentumy;
    // Add the move just made to the momentum, the halve the momentum for next
    // time.
    momentumx = (momentumx + movex) / 2;
    momentumy = (momentumy + movey) / 2;
    // This is the main movement: towards the cursor
    // - calculate hypotenuse to the cursor
    var cursorOffsetX = targetX - manx;
    var cursorOffsetY = targetY - many;
    var cursorHypo = Math.sqrt(Math.pow(cursorOffsetX, 2) + Math.pow(cursorOffsetY, 2));
    // - chase the cursor at a random speed times the eagerness factor
    var chaseStep = (moveMin + (Math.random()*moveMax)) * eagerness;
    // - now convert that back into X/Y movement by multiplying them by the
    //   same proportion
    var prop = chaseStep / cursorHypo;
    var chaseStepX = cursorOffsetX * prop;
    var chaseStepY = cursorOffsetY * prop;
    // - apply the movement
    manx += chaseStepX;
    many += chaseStepY;
    // Actually reposition him!
    $man.css({left: manx+"px", top: many+"px"});
}
function retarget()
{
    var vicinity = 100; // target will be within a square this big
    // centred around the cursor.
    targetX = mouseX + ((Math.random() * vicinity) - (vicinity/2));
    targetY = mouseY + ((Math.random() * vicinity) - (vicinity/2));
}
$(function() {
    $man = $("#man").eq(0);
    // Update the coords whenever mouse is moved
    $(document).mousemove(function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    });
    // Control button click events
    $("#controls .shrink").click(function() {
        $man.css("font-size", function(i, v) {return parseFloat(v) * 0.8;});
    });
    $("#controls .grow").click(function() {
        $man.css("font-size", function(i, v) {return parseFloat(v) * 1.2;});
    });
    $("#controls .sober").click(function() {
        drunkenness *= 0.67;
    });
    $("#controls .drunk").click(function() {
        drunkenness *= 1.5;
    });
    $("#controls .hesitant").click(function() {
        eagerness *= 0.67;
    });
    $("#controls .eager").click(function() {
        eagerness *= 1.5;
    });
    $("#controls .reset").click(function() {
        //$man.css("font-size", "25px");
        drunkenness = 1;
        eagerness = 2;
    });
    // Move at 33.33hz
    setInterval(step, 30);
    // Retarget at 10hz
    setInterval(retarget, 100);
});