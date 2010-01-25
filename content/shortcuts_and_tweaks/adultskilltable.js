/**
 * adultskilltable.js
 * hide unknown youthskills
 * @Authors:  convincedd
 */
////////////////////////////////////////////////////////////////////////////////
var FoxtrickAdultSkillTable = {

    MODULE_NAME : "AdultSkillTable",
	MODULE_CATEGORY : Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
	PAGES : new Array('players'),
	DEFAULT_ENABLED : false,
	NEW_AFTER_VERSION: "0.5.0.2",
	LATEST_CHANGE:"Used abbr for better accessibilty and fixed copy empty cells. More options and some moved to table itself",
	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.NEW,
    OPTIONS : new Array("CopySkillTable","AlsoOtherTeams"),

	copy_string:"",

    init : function() {
    },

    run : function( page, doc ) {
		try  {
			var ownteamid = FoxtrickHelper.findTeamId(doc.getElementById('teamLinks'));
			var teamid = FoxtrickHelper.findTeamId(doc.getElementById('content').getElementsByTagName('div')[0]);
			var is_ownteam = (ownteamid==teamid);
			if (!is_ownteam && !Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, 'AlsoOtherTeams')) return;

			var tablediv = doc.createElement('div');
			tablediv.setAttribute('id','ft_adultskilltable');
			tablediv.className = "ft_skilltablediv";
			var h2 = doc.createElement('h2');
			h2.innerHTML = Foxtrickl10n.getString('Youthskills.Skilltable');
			h2.addEventListener( "click", this.HeaderClick, true );
			h2.setAttribute('class','ft_boxBodyCollapsed');
			tablediv.appendChild(h2);
			var header=doc.getElementsByTagName('h1')[0];
			header.parentNode.insertBefore(tablediv,header.nextSibling);
		}
		catch(e) {Foxtrick.dump('FoxtrickAdultSkillTable.run error: '+e+'\n');}
	},

	change : function( page, doc ) {
	},


	copyTable : function( ev ) {
		var doc = ev.target.ownerDocument;
		Foxtrick.copyStringToClipboard(FoxtrickAdultSkillTable.copy_string );
		if (FoxtrickPrefs.getBool( "copyfeedback" ))
			Foxtrick.alert(Foxtrickl10n.getString("foxtrick.tweaks.yskilltablecopied"));
	},

	sortfunction: function(a,b) {return a.cells[FoxtrickAdultSkillTable.s_index].innerHTML.localeCompare(b.cells[FoxtrickAdultSkillTable.s_index].innerHTML);},
	sortdownfunction: function(a,b) {return parseInt(b.cells[FoxtrickAdultSkillTable.s_index].innerHTML.replace(/\&nbsp| /g,'')) > parseInt(a.cells[FoxtrickAdultSkillTable.s_index].innerHTML.replace(/\&nbsp| /g,''));},
	sortdowntextfunction: function(a,b) {return (b.cells[FoxtrickAdultSkillTable.s_index].innerHTML.localeCompare(a.cells[FoxtrickAdultSkillTable.s_index].innerHTML));},
	sortlinksfunction: function(a,b) {return a.cells[FoxtrickAdultSkillTable.s_index].getElementsByTagName('a')[0].innerHTML.localeCompare(b.cells[FoxtrickAdultSkillTable.s_index].getElementsByTagName('a')[0].innerHTML);},
	sortagefunction: function(a,b) {return a.cells[FoxtrickAdultSkillTable.s_index].getAttribute('age').localeCompare(b.cells[FoxtrickAdultSkillTable.s_index].getAttribute('age'));},

	sortClick : function(ev) {
		try{
			var doc = ev.target.ownerDocument;
			var tablediv = doc.getElementById('ft_adultskilltable');
			var table = tablediv.getElementsByTagName('table')[0];
			var table_old = table.cloneNode(true);
			FoxtrickAdultSkillTable.s_index = ev.target.getAttribute('s_index');
			FoxtrickAdultSkillTable.sort = ev.target.getAttribute('sort');
			if (!FoxtrickAdultSkillTable.s_index) {
				FoxtrickAdultSkillTable.s_index = ev.target.parentNode.getAttribute('s_index');
				FoxtrickAdultSkillTable.sort = ev.target.parentNode.getAttribute('sort');
			}
			//Foxtrick.dump('sortby: '+FoxtrickAdultSkillTable.s_index+'\n');

			var rows= new Array();
			for (var i=2;i<table.rows.length;++i) {
				rows.push(table_old.rows[i]);
			}
			//table.rows[3].innerHTML = table_old.rows[1].innerHTML;
			if (FoxtrickAdultSkillTable.sort == "link")
				rows.sort(FoxtrickAdultSkillTable.sortlinksfunction);
			else if (FoxtrickAdultSkillTable.sort == "age")
				rows.sort(FoxtrickAdultSkillTable.sortagefunction);
			else if (FoxtrickAdultSkillTable.sort == "int")
				rows.sort(FoxtrickAdultSkillTable.sortdownfunction);
			else if (FoxtrickAdultSkillTable.sort == "text")
				rows.sort(FoxtrickAdultSkillTable.sortdowntextfunction);

			for (var i=2;i<table.rows.length;++i) {
				table.rows[i].innerHTML = rows[i-2].innerHTML;
			}
		}
		catch(e) {Foxtrick.dump('sortClick '+e+'\n');}
	},

	customize : function(ev) {
		try {
			var doc = ev.target.ownerDocument;
			doc.getElementById('sidebar').setAttribute('style','display:none');
			doc.getElementById('customizelinkid').setAttribute('style','display:none;');
			doc.getElementById('customizesavelinkid').setAttribute('style','display:inline;cursor:pointer;');
			doc.getElementById('customizecancellinkid').setAttribute('style','display:inline; cursor:pointer; margin-left:10px;');
			doc.getElementById('customizerow').setAttribute('style','display:table-row');

			var tablediv = doc.getElementById('ft_adultskilltable');
			var ths = tablediv.getElementsByTagName('tr')[0].getElementsByTagName('th'); 
			for (var i=0;i<ths.length;++i) ths[i].setAttribute('style','display:table-cell');		// disabled in preferences
			tablediv.getElementsByTagName('tbody')[0].setAttribute('style','display:none'); 
						
		}catch(e) {Foxtrick.dump('customize '+e+'\n');}
	},

	customizesave : function(ev) {
		try {
			var doc = ev.target.ownerDocument;

			var ownteamid = FoxtrickHelper.findTeamId(doc.getElementById('teamLinks'));
			var teamid = FoxtrickHelper.findTeamId(doc.getElementById('content').getElementsByTagName('div')[0]);
			var is_ownteam = (ownteamid==teamid);
			Foxtrick.dump('is_ownteam: '+is_ownteam+'\n');

			var kind='own';
			if (!is_ownteam) kind='other';

			var tablediv = doc.getElementById('ft_adultskilltable');
			var input = tablediv.getElementsByTagName('input'); 
			for (var i=0;i<input.length;++i) {
				FoxtrickPrefs.setBool( "module." + FoxtrickAdultSkillTable.MODULE_NAME + "." + kind+'.'+input[i].name + ".enabled", input[i].checked );
			}
			doc.location.reload();			
		}catch(e) {Foxtrick.dump('customize '+e+'\n');}
	},

	customizecancel : function(ev) {
		try {
			var doc = ev.target.ownerDocument;
			doc.location.reload();			
		}catch(e) {Foxtrick.dump('customize '+e+'\n');}
	},

	HeaderClick : function(ev) {
		try {
			var doc = ev.target.ownerDocument;
			var tablediv = doc.getElementById('ft_adultskilltable');
			var NT_players = (doc.location.href.indexOf("NTPlayers") != -1);
			var Oldies = (doc.location.href.indexOf("Oldies.aspx") != -1);
			var Youth_players = (doc.location.href.indexOf("YouthPlayers\.aspx") != -1);
			var coach = (doc.location.href.indexOf("Coaches\.aspx") != -1);
					
			var table = tablediv.getElementsByTagName('table')[0]
			if (!table || table.style.display=='none')  {
				tablediv.getElementsByTagName('h2')[0].setAttribute('class','ft_boxBodyUnfolded');
				if (table) {
					table.style.display = "table";
					doc.getElementById('customizediv').setAttribute('style','display:inline');
					return;
				}

				var customizediv = doc.createElement('div');
				customizediv.id='customizediv';
				var customizesavelink = doc.createElement('a');
				customizesavelink.id='customizesavelinkid';
				customizesavelink.innerHTML=Foxtrickl10n.getString('foxtrick.prefs.buttonSave');
				customizesavelink.addEventListener('click',FoxtrickAdultSkillTable.customizesave,true);
				customizesavelink.setAttribute('style','display:none; cursor:pointer;');
				customizediv.appendChild(customizesavelink);
			
				var customizecancellink = doc.createElement('a');
				customizecancellink.id='customizecancellinkid';
				customizecancellink.innerHTML=Foxtrickl10n.getString('foxtrick.prefs.buttonCancel');
				customizecancellink.addEventListener('click',FoxtrickAdultSkillTable.customizecancel,true);
				customizecancellink.setAttribute('style','display:none; cursor:pointer;');
				customizediv.appendChild(customizecancellink);

				var customizelink = doc.createElement('a');
				customizelink.id='customizelinkid';
				customizelink.innerHTML=Foxtrickl10n.getString('foxtrick.prefs.buttonCustomize');
				customizelink.addEventListener('click',FoxtrickAdultSkillTable.customize,true);
				customizelink.setAttribute('style','cursor:pointer;');
				customizediv.appendChild(customizelink);
				tablediv.appendChild(customizediv);

				var ownteamid = FoxtrickHelper.findTeamId(doc.getElementById('teamLinks'));
				var teamid = FoxtrickHelper.findTeamId(doc.getElementById('content').getElementsByTagName('div')[0]);
				var is_ownteam = (ownteamid==teamid);
				Foxtrick.dump('is_ownteam: '+is_ownteam+'\n');

				var kind='own';
				if (!is_ownteam) kind='other';
				
				var hasbars=true;
				var allDivs = doc.getElementsByTagName("div");
				if (is_ownteam && !Oldies && !coach) {
					for (var i = 0; i < allDivs.length; i++) {
						if(allDivs[i].className=="playerInfo") {
							var trs = allDivs[i].getElementsByTagName("table")[0].getElementsByTagName("tr");
							if (trs.length==4) {hasbars=false; break;}
						}
					}
					Foxtrick.dump('hasbars: '+hasbars+'\n');
				}

				FoxtrickAdultSkillTable.copy_string = '[table]';
				table = doc.createElement('table');
				table.className = "ft_skilltable";
				thead = doc.createElement("thead");
				FoxtrickAdultSkillTable.copy_string += '[tr]';
				var tr = doc.createElement('tr');
				thead.appendChild(tr);
				var tr2 = doc.createElement('tr');
				tr2.id='customizerow';
				tr2.setAttribute('style','display:none');
				thead.appendChild(tr2);
				table.appendChild(thead);

				var sn;
				if (hasbars) {
					sn = [
						{ name: "Player", abbr: false, sort: "link" },
						{ name: "Age", abbr: false, sort: "age" },
						{ name: "TSI", abbr: true, sort: "int" },
						{ name: "Form", abbr: true, sort: "int" },
						{ name: "Stamina", abbr: true, sort: "int" },
						{ name: "Keeper", abbr: true, sort: "int" },
						{ name: "Defending", abbr: true, sort: "int" },
						{ name: "Playmaking", abbr: true, sort: "int" },
						{ name: "Winger", abbr: true, sort: "int" },
						{ name: "Passing", abbr: true, sort: "int" },
						{ name: "Scoring", abbr: true, sort: "int" },
						{ name: "Set_pieces", abbr: true, sort: "int" },
						{ name: "Yellow_card", abbr: true, sort: "text", img: "/Img/Icons/yellow_card.gif" },
						{ name: "Red_card", abbr: true, sort: "text", img: "/Img/Icons/red_card.gif" },
						{ name: "Bruised", abbr: true, sort: "text", img: "/Img/Icons/bruised.gif" },
						{ name: "Injured", abbr: true, sort: "text", img: "/Img/Icons/injured.gif" },
						{ name: "Speciality", abbr: true, sort: "text", pref: "HideSpecialty" },
						{ name: "Last_stars", abbr: true, sort: "text", pref: "HideLastStars", img: "/Img/Matches/star_blue.png" },
						{ name: "Last_position", abbr: true, sort: "text", pref: "HideLastPosition" }
					];
				}
				else {
					sn = [
						{ name: "Player", abbr: false, sort: "link" },
						{ name: "Age", abbr: false, sort: "age" },
						{ name: "TSI", abbr: true, sort: "int" },
						{ name: "Form", abbr: true, sort: "int" },
						{ name: "Stamina", abbr: true, sort: "int" },
						{ name: "Keeper", abbr: true, sort: "int" },
						{ name: "Playmaking", abbr: true, sort: "int" },
						{ name: "Passing", abbr: true, sort: "int" },
						{ name: "Winger", abbr: true, sort: "int" },
						{ name: "Defending", abbr: true, sort: "int" },
						{ name: "Scoring", abbr: true, sort: "int" },
						{ name: "Set_pieces", abbr: true, sort: "int" },
						{ name: "Yellow_card", abbr: true, sort: "text", img: "/Img/Icons/yellow_card.gif" },
						{ name: "Red_card", abbr: true, sort: "text", img: "/Img/Icons/red_card.gif" },
						{ name: "Bruised", abbr: true, sort: "text", img: "/Img/Icons/bruised.gif" },
						{ name: "Injured", abbr: true, sort: "text", img: "/Img/Icons/injured.gif" },
						{ name: "Speciality", abbr: true, sort: "text", pref: "HideSpecialty" },
						{ name: "Last_stars", abbr: true, sort: "text", pref: "HideLastStars", img: "/Img/Matches/star_blue.png" },
						{ name: "Last_position", abbr: true, sort: "text", pref: "HideLastPosition" }
					];
				}
				var s_index = 0;
				for (var j = 0; j < sn.length; j++) {
					if ((!is_ownteam || Oldies || NT_players || coach) && j>=5 && j<=11)
						continue;

					var th = doc.createElement('th');					
					var th2 = doc.createElement('th');					
					var check = doc.createElement( "input" );	
					check.setAttribute( "type", "checkbox" );
					check.setAttribute( "name", sn[j].name );
					check.setAttribute( "id", sn[j].name );
					if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[j].name)) {
						check.setAttribute( "checked", "checked" );
					}
					else {
						th.style.display = "none"; // disabled in preferences
					}
					th.setAttribute("s_index", s_index++);
					if (sn[j].sort) {
						th.setAttribute("sort", sn[j].sort);
					}
					th.addEventListener("click", FoxtrickAdultSkillTable.sortClick, true);
					th2.appendChild( check );
					
					
					if (sn[j].abbr) {
						if (sn[j].img) {
							var img = doc.createElement("img");
							img.setAttribute("src", sn[j].img);
							img.setAttribute("alt", Foxtrickl10n.getString(sn[j].name + ".abbr"));
							img.setAttribute("title", Foxtrickl10n.getString(sn[j].name));
							th.appendChild(img);
						}
						else {
							var abbr = doc.createElement("abbr");
							abbr.setAttribute("title", Foxtrickl10n.getString(sn[j].name));
							abbr.appendChild(doc.createTextNode(Foxtrickl10n.getString(sn[j].name + ".abbr")));
							th.appendChild(abbr);
						}
					}
					else {
						if (sn[j].img) {
							var img = doc.createElement("img");
							img.setAttribute("src", sn[j].img);
							img.setAttribute("alt", Foxtrickl10n.getString(sn[j].name));
							img.setAttribute("title", Foxtrickl10n.getString(sn[j].name));
						}
						else {
							th.appendChild(doc.createTextNode(Foxtrickl10n.getString(sn[j].name)));
						}
					}
					tr.appendChild(th);
					tr2.appendChild(th2);

					// copy string
					if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[j].name)) {
						FoxtrickAdultSkillTable.copy_string += '[th]';
						if (sn[j].abbr) {
							FoxtrickAdultSkillTable.copy_string += Foxtrickl10n.getString(sn[j].name + ".abbr");
						}
						else {
							FoxtrickAdultSkillTable.copy_string += Foxtrickl10n.getString(sn[j].name);
						}
						FoxtrickAdultSkillTable.copy_string += '[/th]';
					}
				}
				FoxtrickAdultSkillTable.copy_string += '[/tr]';
						
				
				var tbody = doc.createElement("tbody");
				table.appendChild(tbody);

				// get last match
				var latestMatch=-1;
				if (!Oldies && !NT_players && !coach) {
					for(var i = 0; i < allDivs.length; i++) {
						if(allDivs[i].className=="playerInfo") {
							var as=allDivs[i].getElementsByTagName('a');
							var j=0,a=null;
							while(a=as[j++]){if (a.href.search(/matchid/i)!=-1) break;}
							var matchday=0;
							if (a) matchday=Foxtrick.getUniqueDayfromCellHTML(a.innerHTML);
							if (matchday>latestMatch) latestMatch = matchday;
						}
					}
				}

				var count =0;
				for(var i = 0; i < allDivs.length; i++) {
					if(allDivs[i].className=="playerInfo") {
						count++;
						var k=0;
						var sktable = allDivs[i].getElementsByTagName("table")[0];
						if (sktable && sktable.parentNode.className.search('myht2')!=-1) sktable=null;
						if (sktable) var trs = sktable.getElementsByTagName("tr");

						var has_flag = (allDivs[i].getElementsByTagName("a")[0].innerHTML.search(/flags.gif/i)!=-1);
						var link_off=0;
						if (has_flag) link_off=1;

						FoxtrickAdultSkillTable.copy_string += '[tr]';
						var tr = doc.createElement('tr');
						tbody.appendChild(tr);

						// name (linked)
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 FoxtrickAdultSkillTable.copy_string += allDivs[i].getElementsByTagName("a")[0+link_off].innerHTML;  // unlinked
						 td.appendChild(allDivs[i].getElementsByTagName("a")[0+link_off].cloneNode(true));
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}

						// age
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 var age = allDivs[i].getElementsByTagName("p")[0].innerHTML.match(/(\d+)/g);
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 FoxtrickAdultSkillTable.copy_string += age[0]+'.'+age[1];
						 td.innerHTML=age[0]+'.'+age[1];
						 td.setAttribute('age',age[0]+'.'+(age[1].length==1?('00'+age[1]):(age[1].length==2?('0'+age[1]):age[1])));
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}
						
						var specc = allDivs[i].getElementsByTagName( "p" )[0];

						// tsi etc
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 var tsitot_in = allDivs[i].getElementsByTagName('p')[0].innerHTML.substr(0,specc.innerHTML.lastIndexOf('<br>'));
						 if (Oldies || NT_players) tsitot_in = tsitot_in.substr(0,tsitot_in.lastIndexOf('<br>'));
						 //Foxtrick.dump (' => tsitot_in => [' + tsitot_in + ']\n');
						 if (tsitot_in.search(/^\s*TSI/) != -1)
							tsitot_in = tsitot_in.replace(/,.+/,''); // In the language Vlaams, TSI and age are switched. This is a fix for that
						 var lastindex = tsitot_in.lastIndexOf(' ');
						 if (tsitot_in.lastIndexOf('=') > lastindex)
							lastindex = tsitot_in.lastIndexOf('=');
						 tsitot_in = tsitot_in.substr(lastindex+1).replace('&nbsp;','');
						 tsitot_in = parseInt(tsitot_in);
						 td.appendChild(doc.createTextNode(tsitot_in));
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}

						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 var val = allDivs[i].getElementsByTagName("a")[1+link_off].href.match(/ll=(\d+)/)[1];
						 td.appendChild(doc.createTextNode(val));
						 FoxtrickAdultSkillTable.copy_string += val
					 	 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}
						
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 var val = allDivs[i].getElementsByTagName("a")[2+link_off].href.match(/ll=(\d+)/)[1];
						 td.appendChild(doc.createTextNode(val));
						 FoxtrickAdultSkillTable.copy_string += val
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}


						// skills
						if (is_ownteam && !Oldies && !NT_players && !coach ) {
							var start=0,end=7,inc=1;
							if (!hasbars) {start=2,end=16;inc=2;}
							for(var j = start; j < end; j+=inc) {
							if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
								FoxtrickAdultSkillTable.copy_string += '[td]';
								var td = doc.createElement('td');
								tr.appendChild(td);

								if (sktable) {
									if (hasbars) {
										var tds = trs[j].getElementsByTagName("td");
										var imgs = tds[1].getElementsByTagName('img');
										var cur = imgs[0].title.match(/-?\d+/);
										FoxtrickAdultSkillTable.copy_string += cur;
										td.innerHTML = cur;
									}
									else {
										var tds= allDivs[i].getElementsByTagName("table")[0].getElementsByTagName("td");
										var cur = tds[j+1].getElementsByTagName('a')[0].href.match(/ll=(\d+)/)[1];
										FoxtrickAdultSkillTable.copy_string += cur;
										td.innerHTML = cur;
									}
								}
								FoxtrickAdultSkillTable.copy_string += '[/td]';
							}
							}
						}
						else {k+=7;}
						
						// card+injuries
						var cardsyellow=0;
						var cardsred=0;
						var bruised=0;
						var injured=0;
						var img = allDivs[i].getElementsByTagName("img");

						for(var j = 0; j < img.length; j++) {
							if (img[j].className=='cardsOne') {
								if (img[j].src.indexOf('red_card', 0) != -1 ) cardsred = 1;
								else cardsyellow=1;
							}
							if (img[j].className=='cardsTwo') {
								cardsyellow=2;
							}
							if (img[j].className=='injuryBruised') bruised=1;
							if (img[j].className=='injuryInjured') injured = img[j].nextSibling.innerHTML;
						}

						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 if (cardsyellow>0) {
							td.appendChild(doc.createTextNode(cardsyellow));
							FoxtrickAdultSkillTable.copy_string += cardsyellow;
						 }
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}

						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 if (cardsred>0) {
							td.appendChild(doc.createTextNode(cardsred));
							FoxtrickAdultSkillTable.copy_string += cardsred;
						 }
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}
						
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 if (bruised>0) {
							td.appendChild(doc.createTextNode(bruised));
							FoxtrickAdultSkillTable.copy_string += bruised;
						 }
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}
						
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
						 FoxtrickAdultSkillTable.copy_string += '[td]';
						 var td = doc.createElement('td');
						 if (injured>0) {
							td.appendChild(doc.createTextNode(injured));
							FoxtrickAdultSkillTable.copy_string += injured;
						 }
						 FoxtrickAdultSkillTable.copy_string += '[/td]';
						 tr.appendChild(td);
						}
						// specialty
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
							FoxtrickAdultSkillTable.copy_string += '[td]';
							var td = doc.createElement('td');
							specMatch = specc.textContent.match(/\[(\D+)\]/);
							if (specMatch) {
								var shortspecc = FoxtrickAdultSkillTable._getShortSpecialty(specMatch[1]);
								if (shortspecc) {
									specMatch = shortspecc;
								}
								else {
									specMatch = specMatch[1].substr(0,2);
									Foxtrick.dump('fallback '+specMatch+'\n')
								}
							}
							else specMatch='';
							td.appendChild(doc.createTextNode(specMatch));
							FoxtrickAdultSkillTable.copy_string += specMatch;
							FoxtrickAdultSkillTable.copy_string += '[/td]';
							tr.appendChild(td);
						}

						// get played last match
						var as=allDivs[i].getElementsByTagName('a');
						var kk=0,a=null;
						while(a=as[kk++]){if (a.href.search(/matchid/i)!=-1) break;}
						var matchday=0;
						if (a) matchday=Foxtrick.getUniqueDayfromCellHTML(a.innerHTML);

						// stars
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
							FoxtrickAdultSkillTable.copy_string += '[td]';
							var td = doc.createElement('td');
							if (matchday==latestMatch) {
								var imgs=a.parentNode.parentNode.getElementsByTagName('img');
								var starcount=0;
								for (var sc=0;sc<imgs.length;++sc) {
									if (imgs[sc].className=='starBig') starcount+=5;
									else if (imgs[sc].className=='starWhole') starcount+=1;
									else if (imgs[sc].className=='starHalf') starcount+=0.5;
								}
								td.appendChild(doc.createTextNode(starcount));
								FoxtrickAdultSkillTable.copy_string += starcount;
							}
							FoxtrickAdultSkillTable.copy_string += '[/td]';
							tr.appendChild(td);
						}

						// last position
						if (Foxtrick.isModuleFeatureEnabled(FoxtrickAdultSkillTable, kind+'.'+sn[k++].name)) {
							FoxtrickAdultSkillTable.copy_string += '[td]';
							var td = doc.createElement('td');
							if (matchday == latestMatch) {
								var pos = a.parentNode.nextSibling.nextSibling.innerHTML.match(/\((.+)\)/)[1];
								var shortpos = FoxtrickAdultSkillTable._getShortPos(pos);
								if (shortpos) {
									pos = shortpos;
								}
								else {
									var sp_pos = pos.search(/ |\&nbsp;/);
									if (sp_pos == -1) pos=pos.substr(0,2)
									else pos = pos.substr(0,1)+pos.substr(sp_pos+1,1);
									Foxtrick.dump('fallback '+pos+'\n')
								}
								td.appendChild(doc.createTextNode(pos));
								FoxtrickAdultSkillTable.copy_string += pos;
							}
							FoxtrickAdultSkillTable.copy_string += '[/td]';
							tr.appendChild(td);
						}

						//Foxtrick.dump(matchday+' '+latestMatch+'\n');
						FoxtrickAdultSkillTable.copy_string += '[/tr]';
					}
				}
				FoxtrickAdultSkillTable.copy_string += '[/table]';

				tablediv.appendChild(table);

				// copy button
				if (Foxtrick.isModuleFeatureEnabled( FoxtrickAdultSkillTable, "CopySkillTable" )) {
					if (FoxtrickPrefs.getBool( "smallcopyicons" )) {
						if (doc.getElementById('copyskilltable')) return;
						var boxHead = doc.getElementById('mainWrapper').getElementsByTagName('div')[1];
						if (boxHead.className!='boxHead') return;

						if (Foxtrick.isStandardLayout(doc)) doc.getElementById('mainBody').setAttribute('style','padding-top:20px;');

						var messageLink = doc.createElement("a");
						messageLink.className = "inner copyicon copyplayerad ci_first";
						messageLink.title = Foxtrickl10n.getString("foxtrick.tweaks.copyskilltable" );
						messageLink.id = "copyskilltable" ;
						messageLink.addEventListener("click", FoxtrickAdultSkillTable.copyTable, false)

						var img = doc.createElement("img");
						img.alt = Foxtrickl10n.getString( "foxtrick.tweaks.copyskilltable" );
						img.src = Foxtrick.ResourcePath+"resources/img/transparent_002.gif";

						messageLink.appendChild(img);
						boxHead.insertBefore(messageLink,boxHead.firstChild);
					}
					else {
						var parentDiv = doc.createElement("div");
						parentDiv.id = "foxtrick_copy_parentDiv";

						var messageLink = doc.createElement("a");
						messageLink.className = "inner";
						messageLink.title = Foxtrickl10n.getString("foxtrick.tweaks.copyskilltable" );
						messageLink.setAttribute("style","cursor: pointer;");
						messageLink.addEventListener("click", FoxtrickAdultSkillTable.copyTable, false)

						var img = doc.createElement("img");
						img.style.padding = "0px 5px 0px 0px;";
						img.className = "actionIcon";
						img.alt = Foxtrickl10n.getString( "foxtrick.tweaks.copyskilltable" );
						img.src = Foxtrick.ResourcePath+"resources/img/copyplayerad.png";
						messageLink.appendChild(img);

						parentDiv.appendChild(messageLink);

						var newBoxId = "foxtrick_actions_box";
						Foxtrick.addBoxToSidebar( doc, Foxtrickl10n.getString(
							"foxtrick.tweaks.actions" ), parentDiv, newBoxId, "first", "");
					}
				}
			}
			else {
				table.style.display='none';
				doc.getElementById('customizediv').setAttribute('style','display:none');
				tablediv.getElementsByTagName('h2')[0].setAttribute('class','ft_boxBodyCollapsed');
			}
		}
		catch(e) {Foxtrick.dump('SkillTableHeaderClick: '+e+'\n');}
	},

	_getShortPos: function(pos) {
		var short_pos='';
		try {
		  var lang = FoxtrickPrefs.getString("htLanguage");
		}
		catch (e) {
		  return null;
		}

		try {
			var type = pos.replace(/&nbsp;/,' ');
			var path = "hattricklanguages/language[@name='" + lang + "']/positions/position[@value='" + type + "']";
			short_pos = Foxtrick.xml_single_evaluate(Foxtrick.XMLData.htLanguagesXml, path, "short");
			return short_pos
		}
		catch (e) {
			Foxtrick.dump('youthskill.js _getShort: '+e + "\n");
			return null;
		}

		return short_pos;
	},

	_getShortSpecialty: function(pos)
	{
		var short_pos='';
		try {
		  var lang = FoxtrickPrefs.getString("htLanguage");
		}
		catch (e) {
		  return null;
		}

		try {
			var type = pos.replace(/&nbsp;/,' ');
			var path = "hattricklanguages/language[@name='" + lang + "']/specialties/specialty[@value='" + type + "']";
			short_pos = Foxtrick.xml_single_evaluate(Foxtrick.XMLData.htLanguagesXml, path, "short");
			return short_pos
		}
		catch (e) {
			Foxtrick.dump('youthskill.js _getShort: '+e + "\n");
			return null;
		}

		return short_pos;
	},
}
