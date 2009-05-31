/**
 * Formates the match report.
 *  * @author spambot
 */

FoxtrickMatchReportFormat = {
	MODULE_NAME : "MatchReportFormat",
	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,
	DEFAULT_ENABLED : true,
	NEW_AFTER_VERSION: "0.4.8.2",
	LASTEST_CHANGE:"some format of match report for better reading",
	//OPTIONS : new Array("DefaultShow"), 
	
	init : function() {
        Foxtrick.registerPageHandler( "match", this );
    },
    
    run : function( page, doc ) {
        
		var isarchivedmatch = (doc.getElementById("ctl00_CPMain_lblMatchInfo")==null);
		if (!isarchivedmatch) return;
        
        var div = doc.getElementById('mainBody');
        var div_check = getElementsByClass('ft_mR_format', div);
        if  (div_check.length > 0) return;

        var links = div.getElementsByTagName('a');
        var supporter = false;
        for (i=0; i < links.length; i++) {
//            dump('i:' + i + ':' + links[i].href + ': '+ supporter + '\n' );
            if (links[i].href.search('Book') > 0) {
                supporter = true;
                break;
            }
        }

        var div_inner = getElementsByClass('', div)[2];
        if (!supporter) div_inner = getElementsByClass('', div)[1];
        // dump(' >'+ div_inner.innerHTML + ' < \n');
        var start = div_inner.innerHTML.indexOf('<br><br>');
        var end = div_inner.innerHTML.indexOf('<div class="separator">');
        
        var part = new Array('','','');
        part[0] = div_inner.innerHTML.substr(0, start);
        
        part[1] = div_inner.innerHTML.substr(start, end-start);
        var dummy = part[1].split('<br><br>');
        // Foxtrick.alert(dummy[1]);

        part[0] += '' + dummy[0] + '<br><br>' + dummy[1] + '<br>';
        part[1] = '';
        for (i = 2; i< dummy.length; i++) {
            part[1] += dummy[i] + '<br><br>';
        }
        
        
        part[2] = div_inner.innerHTML.substr(end, div_inner.innerHTML.length-end );
        // dump('start[' + start + '|' + end + ']');
        // dump(part[1]);
        part[1] = this.nl2br(part[1]);
        
        search = new Array(
//            /\=(\d+)/g,
            /\-(\d{1,3})/g,
            /\s(\d{1,3})/g,
            /(\s{5,})/g,
            /\<br \/\>br\<br \/\>br/g
            // /\<br\>(.{5,})\<br\>/i
            );
        replace = new Array(
//            "=$1&formatted",
            "-<span class='ft_mR_format' style='font-weight:bold;color:black'>$1</span>",
            "<span class='ft_mR_format' style='font-weight:bold;color:black'> $1</span>",
            "br",
            "<br>\n"
            // "<div>$1</div>"
            );
        part[0] = part[0].replace(/(.{1,2})\-(.{1,2})\-(.{1,2})\ /g,"<span class='ft_mR_format' style='font-weight:bold;color:black'>$1</span>-<span class='ft_mR_format' style='font-weight:bold;color:black'>$2</span>-<span class='ft_mR_format' style='font-weight:bold;color:black'>$3</span> ");
        part[0] = part[0].replace(/(.{1,2})\-(.{1,2})\-(.{1,2})\-/g,"<span class='ft_mR_format' style='font-weight:bold;color:black'>$1</span>-<span class='ft_mR_format' style='font-weight:bold;color:black'>$2</span>-<span class='ft_mR_format' style='font-weight:bold;color:black'>$3</span>-");
        for (var i = 0; i<search.length; i++) {
            part[1] = part[1].replace(search[i],replace[i]);
        }
        
        dummy = (part[0] + part[1]).split('\n');

        part[1]= '';
        var stage = 0; 
        var fulltext = 0;
        var marg = '';
        var bg = '';
        var padd = '';
        var next = 0;
        var player = false;
        for (i=0; i<dummy.length;i++) {
            marg='margin-top:10px; border:1px solid #ccc;'
            padd='padding:2px; border:1px solid #ccc;'
            if (i%2 ==1) {bg='#EFFFEF; ';} else {bg='#EFFFEF; ';}
            dummy[i] =Foxtrick.trim(dummy[i]);
            if  (dummy[i] == '<br>') dummy[i] = '';
            if ( (!(dummy[i].indexOf('<br><br>')<0) && fulltext > 2) || (i > dummy.length-3)) {
                if (dummy[i].indexOf('/Players/')<0) bg='#D2EFD1; ';
                marg = 'margin-top:10px; margin-bottom:30px; border:1px solid #ccc; ';
                if (dummy[i].indexOf('/Players/')>0) marg = 'margin-top:30px; margin-bottom:10px; ';
            }
            dummy[i] = dummy[i].replace(/\<br\>/g, '');
            if (dummy[i] != '') {
                //dump(i + ' [' + dummy[i] + ']\n');
                if (dummy[i].split(' - ').length == 2 && stage == 0) { //headder
                    // dump('TEAMS FOUND\n');
                    var names = dummy[i].split(' - ');
                    var team1 = names[0].split('  ')[0];
                    var team2 = names[1].split('  ')[1];
                    stage = 1;
                    dump('TEAMS [' + team1 + '|' + team2 + ']\n');
                }
                if (stage==1 && dummy[i].indexOf('<span>(')!=-1) {
                    dump('MATCHID\n');
                    dummy[i] = dummy[i].replace(/\<span\>\(/,'<span> (');
                }
                if (dummy[i].indexOf('/Arena/') != -1) stage +=1;
                
                if (stage>1) { //full report
                    if (dummy[i].indexOf(team1) > -1 && !(dummy[i].indexOf('/Arena/') > -1)) {
                        fulltext++;
                        dummy[i] = dummy[i].replace(team1, '<span style="font-weight:bold; color:#9F0202">' + team1 + '</span>');
                        if (fulltext <= 2) bg='#D2EFD1; ';
                    }
                    if (dummy[i].indexOf(team2) > -1 && !(dummy[i].indexOf('/Arena/') > -1)) {
                        fulltext++;                 
                        dummy[i] = dummy[i].replace(team2, '<span style="font-weight:bold; color:#16029F">' + team2 + '</span>');
                        if (fulltext <= 2) { 
                            bg='#D2EFD1; ';
                            next = i+2;
                            //dump('>>>' + next + '\n');
                        }
                    }
                    if (next == i) marg = 'margin-top:10px; margin-bottom:40px; '
                    
                    part[1] += '<div id="ft_mR_div_' + i + '" style="border:0px solid blue; '+ marg+' background:' + bg + padd +'">' + dummy[i] + '</div>\n\n';
                }
                else part[1] += dummy[i] + '\n\n';
            }
            // else dump(i + ' DROPED ' + dummy[i] + ']\n');
        }
        div_inner.innerHTML = part[1] + part[2];

        var standing = new Array(0,0);
        var reg = /\ (\d{1,2})\ \-\ (\d{1,2})(.*?)/i;
        var divs = div.getElementsByTagName('div');
        for (i=0; i < divs.length; i++) {
            // dump(i + ': ' + divs[i].textContent + '\n\n');
            var text = divs[i].textContent;
            var score = reg.exec(text);
            if (score && i > 4) {
                dump('[' + score + ']\n');
                if (score[1] > standing[0]) {
                    standing[0]++;
                    divs[i].style.border ='1px solid red';
					divs[i].style.background ='#FFECEC';
                    // dump('A \n');
                }
                if (score[2] > standing[1]) {
                    standing[1]++;
                    divs[i].style.border ='1px solid blue';
					divs[i].style.background ='#EEECFF';
                    // dump('B \n');
                }
            }
            
        }
        
    },

	change : function( page, doc ) {
        var div_check = getElementsByClass('ft_mR_format', doc);
        if  (div_check.length > 0) return;
    },
    nl2br : function(text) {
        text = escape(text);
        if(text.indexOf('%0D%0A') > -1){
            re_nlchar = /%0D%0A/g ;
        }else if(text.indexOf('%0A') > -1){
            re_nlchar = /%0A/g ;
        }else if(text.indexOf('%0D') > -1){
            re_nlchar = /%0D/g ;
        }
        return unescape( text.replace(re_nlchar,'<br />') );
    },    
    
};