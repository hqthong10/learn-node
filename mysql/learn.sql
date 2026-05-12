CREATE DEFINER=`webinaris`@`localhost` PROCEDURE `apiver3_listoftabc100zz`(pnFK100  INT
																		  ,pnFB050    INT            -- ID webinar																		  
                                                                          ,pvKEY      varchar(128)    -- KEY 
                                                                          ,pvLOGIN    VARCHAR(128))
TimeZone:BEGIN
   --
   --
   DECLARE nBN057   INT;
   DECLARE nBN057D  INT;
   declare nBN073   integer;
   --
   declare nFZ700   integer;
   declare nMZ700   integer;
   -- timezones
   declare vBV066  varchar(16);
   declare vBV102  varchar(1);
   --
   declare dDATUM  datetime;
   declare nCN003  integer;
   declare nRETUR  INT;
   --
   if (ifnull(pnFB050,0) = 0) then
     leave TimeZone;
   end if;
   --
   select ifnull(b0.BN057,3) as BN057, ifnull(b0.BN057,3)*5 as BN057D, b0.BN073
         ,ifnull(b0.BV066,'A') as BV066, ifnull(b0.BV102,'N') as BV102
     into nBN057, nBN057D, nBN073, vBV066, vBV102
     from b050 b0
    where b0.PB050 = pnFB050
	  and b0.FK100 = pnFK100
      AND ifnull(b0.BV099, md5(concat(b0.FK100, b0.PB050))) = pvKEY
      and b0.BL095 IS NULL;
   --
   set nFZ700 = 15;
   --
   if (vBV066 = 'A') then
     set nMZ700 = 15;
   else
     --
     set nFZ700 = vBV066;
     set nMZ700 = vBV066;
     --
   end if;
   -- block any day from system
   select ifnull(max(cc.CN003),-1) into nCN003
     from c000 cc
	where cc.CL015 is null;
   --
   -- sofort
   -- full = 10, 15, 30. 60 min
   set dDATUM = cver5_nextshowtimesofo(nFZ700, nMZ700, pnFB050, pnFK100, 'viewer');
   --
   select date_format(cc.TERMI, '%d.%m.%Y %H:%i') as SHOWTIME
		 ,cc.VFREE
         ,cc.MAXVI, cc.AUTODETECTION, cc.SHOWTZ, cc.MVIEW
         ,zz2025_getdifftabz100ro(nFZ700, cc.TERMI, 'viewer') as ZN104
         ,cc.FN150, cc.FS200, cc.FB050, cc.FK100, cc.PRIOR, cc.CV120
         ,UNIX_TIMESTAMP(cc.TERMI) as UNIX
         ,replace(zz2020_timezutctabz100(nMZ700, cc.TERMI, 'Viewer'), '0', '') as TZONE
         ,zz2025_checkidoftabz700(nFZ700, 'viewer') as TIMEZONE
		 -- ,z2025_timezonename_utc(date_format(cc.TERMI, '%Y-%m-%d %H:%i:%s'), replace(zz2020_timezutctabz100(nMZ700, cc.TERMI, 'Viewer'), '0', ''), nFZ700, 'viewer') as TIMEZONE														
	from (select distinct cc.WETYPE
                ,cc.TERMI, DATE_FORMAT(cc.DBTER, '%d.%m.%Y %H:%i') as mydate
                --
                ,dayofweek(cc.DBTER) as DOW
                ,hour(cc.TERMI) as CN102
                ,minute(cc.TERMI) as CN103
                ,case greatest(round(((0.2*cc.BN158)/100)*cc.STUNDE), 1)
                 when 1 then 1 else case greatest(round(((0.2*cc.BN158)/100)*cc.STUNDE),cc.BN158)
                                    when cc.BN158 then round(((0.2*cc.BN158)/100)*cc.STUNDE)
                                    else cc.BN158 end
				 end as VFREE
			    ,cc.BN073 AS MAXVI
                ,cc.BV066 as AUTODETECTION
                ,cc.BV102 as SHOWTZ
                ,cc.KN132 as MVIEW
                ,cc.FN150, cc.FS200, cc.FB050, cc.FK100, cc.PRIOR, cc.CV120
                -- ,cc.ZN104
                ,cc.CN112, cc.MINDI
                --
			from (select bb.WETYPE, bb.CN102, bb.CN103, bb.CN111, bb.CN112, bb.CN114, bb.CN115, bb.CN118, bb.CN119, bb.CV120
                        ,bb.TERMI, bb.DBTER, bb.MINDI
                        ,hour(timediff(sysdate(), bb.TERMI)) as STUNDE
						-- 
                        ,'A' as BV066, bb.BN073, bb.BV102, bb.BN156, bb.BV157, bb.BN158, kk.KN132
						,bb.FN150, bb.FS200, bb.FB050, bb.FK100, bb.PRIOR
					from (-- sofort, full = 10,15,30,60 min
						  select cc.WETYPE, cc.CN102, cc.CN103, cc.CN111, cc.CN112, cc.CN114, cc.CN115, cc.CN118, cc.CN119, cc.CV120
								 -- Termin
								,cc.TERMI, cc.MINDI
                                ,date_add(cc.DBTER, interval cc.MINDI minute) as DBTER
								--
								,cc.BV066, cc.BN073, cc.BV102, cc.BN156, cc.BV157, cc.BN158
								,cc.FN150, cc.FS200, cc.FB050, cc.FK100, cc.PRIOR
							from (select cc.WETYPE, cc.CN102, cc.CN103, cc.CN111, cc.CN112, cc.CN114, cc.CN115, cc.CN118, cc.CN119, cc.CV120
								         -- Termin
								        ,dDATUM as TERMI
							            ,0 as MINDI
							            -- ,cver5_nextshowtimes(dDATUM, @TERMI, cc.CN112, cc.BN158, cc.FB050, cc.FK100, 'viewer') as MINDI
                                        ,cc.TERMI as DBTER
								        --
								        ,cc.BV066, cc.BN073, cc.BV102, cc.BN156, cc.BV157, cc.BN158
								        ,cc.FN150, cc.FS200, cc.FB050, cc.FK100, cc.PRIOR
                                        -- ,null as TERMII
							        from (select @FB050 := pnFB050, @FK100 := pnFK100) bb
									join c100sofo_ver5_v cc on (1 = 1)
						           where dDATUM is not null
								 ) cc
						   union
						  -- normal, full = 60 min
						  select cc.WETYPE, cc.CN102, cc.CN103, cc.CN111, cc.CN112, cc.CN114, cc.CN115, cc.CN118, cc.CN119, cc.CV120
                                --
                                ,date_add(cc.TERMI, interval cc.MINDI minute) as TERMI, cc.MINDI
                                ,date_add(cc.DBTER, interval cc.MINDI minute) as DBTER
                                --
								,cc.BV066, cc.BN073, cc.BV102, cc.BN156, cc.BV157, cc.BN158
								,cc.FN150, cc.FS200, cc.FB050, cc.FK100, cc.PRIOR
							from (select cc.WETYPE
								        ,lpad(cc.CN102, 2, '0') AS CN102, LPAD(cc.CN103, 2, '0') AS CN103
								        ,cc.CN111, 0 as CN112, cc.CN114, cc.CN115, cc.CN118, cc.CN119, cc.CV120
								        -- 
								        ,cc.TERMI as TERMI										
								        ,0 as MINDI
								        -- ,cver5_nextshowtimes(cc.TERMI, @TERMI, 60, cc.BN158, cc.FB050, cc.FK100, 'viewer') as MINDI
                                        ,zz2025_getdatedbank(cc.TERMI, 'N', zz2021_getdifftabz100ro(nFZ700, cc.TERMI, 'viewer'), 'viewer') as DBTER
								        --
								        ,cc.BV066, cc.BN073, cc.BV102, cc.BN156, cc.BV157, cc.BN158
								        ,cc.FN150, cc.FS200, cc.FB050, cc.FK100, cc.PRIOR
								        -- ,(select @TERMI := date_add(cc.TERMI, interval cver5_nextshowtimes(cc.TERMI, @TERMI, 60, cc.BN158, cc.FB050, cc.FK100, 'viewer') minute)) as TERMII
							        from (select @FB050 := pnFB050, @FK100 := pnFK100) bb
							        join c100tagl_ver5_v cc on (1 = 1)
								 ) cc
							-- TERMIN  <> SOFORT
						   where TERMI <> ifnull(dDATUM,date_add(sysdate(), interval -1 day))
				           -- order by WETYPE
						 ) bb
					join k100 kk on (kk.PK100 = bb.FK100)
				   where kk.PK100 = pnFK100
					 and not exists (select c0.*
											   from c050 c0 use index (IND_C050_FB050)
											  where c0.FK100 = bb.FK100
                                                and ifnull(c0.FB050,0) = case ifnull(c0.FB050,0) when 0 then ifnull(c0.FB050,0) else bb.FB050 end
                                                and bb.TERMI between c0.CD053 and ifnull(c0.CD054, date_add(c0.CD053, interval 1 day))
                                                and c0.CN055 = 0
										        and c0.CL065 is null
											  union
											 select c0.*
								               from c050 c0 use index (IND_C050_FB050)
											  where c0.FK100 = bb.FK100
                                                and ifnull(c0.FB050,0) = case ifnull(c0.FB050,0) when 0 then ifnull(c0.FB050,0) else bb.FB050 end
                                                and c0.CN055 = 1
                                                and bb.TERMI between str_to_date(concat(date_format(c0.CD053, '%d.%m.'), year(sysdate())), '%d.%m.%YYYY')
                                                                 and ifnull(date_add(str_to_date(concat(date_format(c0.CD054, '%d.%m.')
																								,date_format(sysdate(), '%Y') + 
                                                                                                 case when date_format(c0.CD053, '%Y') = date_format(c0.CD054, '%Y') 
                                                                                                      then 0 else 1 end), '%d.%m.%YYYY'), interval 1 day)
                                                                           ,date_add(str_to_date(concat(date_format(c0.CD053, '%d.%m.'), year(sysdate())), '%d.%m.%YYYY'), interval 1 day))
										        and c0.CL065 is null) 
				   order by bb.TERMI
                 ) cc -- on (cc.FB050 = bb.PB050 and cc.FK100 = bb.FK100)
		   where DATE_FORMAT(cc.DBTER, '%Y-%m-%d') >= DATE_FORMAT(date_add(sysdate(), interval ifnull(cc.BN156,0) day),'%Y-%m-%d')
             -- global block setting
			 and case nCN003
                 -- block any day
                 when -1 then cc.DBTER >= str_to_date(DATE_FORMAT(sysdate(), '%d.%m.%Y %H:%i'),'%d.%m.%Y %H:%i')
                 -- block today
                 when 0 then cc.DBTER >= sysdate()
                 -- block today and tomorrow
                 when 1 then cc.DBTER >= date_add(sysdate(), interval 1 DAY)
                 -- block tomorrow and tomorrow+1
                 when 2 then cc.DBTER >= date_add(sysdate(), interval 2 DAY)
                 -- block next 3 days
                 -- block next 4 days
                 -- block next 5 days
                 -- block next 6 days
                 else cc.TERMI >= date_add(sysdate(), interval nCN003 DAY)
                 end
			 and cc.DBTER >= sysdate()
			 --
	       order by case cc.CV120 when 'D' then cc.PRIOR else 0 end, cc.TERMI
           limit nBN057
		) cc
	order by TERMI;
   --
END