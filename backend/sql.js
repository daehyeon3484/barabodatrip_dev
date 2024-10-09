module.exports = {
  nationCodeList : {
    query : `SELECT	nation_cd,
                    nation_nm,
                    nation_real_cd,
                    nation_kor_nm,
                    unit,
                    currency_unit
            FROM	tp_nation_code
            WHERE	?
            and     use_yn = 'Y'
            `
  },
  productList : {
    query : `
    select  tp.prod_id,
            tp.prod_title,
            tp.opt_code,
            tp.prod_desc,
            tp.tr_place,
            tp.prod_category,
            tp.prod_type,
            tp.inventory_cnt,
            tp.prod_price as origin_price,
            tp.prod_price_tp,
            tp.lan_tp,
            tp.test_yn,
            tp.progress_yn,
            ROUND(( SELECT (tp.prod_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) prod_price,
            date_format(tp.start_date, '%Y-%m-%d') as start_date,
            date_format(tp.end_date, '%Y-%m-%d') as end_date,
            date_format(tp.reg_date, '%Y-%m-%d %H:%i:%s') as reg_date,
            (select file_name from tp_prod_file where prod_id = tp.prod_id and file_type='1') file_name,
            (select file_path from tp_prod_file where prod_id = tp.prod_id and file_type='1') file_path,
            CONCAT(date_format(tp.start_date,'%Y-%m-%d'),'~',date_format(tp.end_date,'%Y-%m-%d')) ymd_format,
            tp.package_type
    FROM    tp_prod tp
    where   tp.view_yn = 'Y'
    and     tp.test_yn = 'N'
    and     tp.lan_tp = ?
    and     tp.prod_type != 'CG003'
    order by tp.progress_yn DESC,tp.reg_date DESC
    `
  },
  productList1 : {
    query : `
    select  tp.prod_id,
            tp.prod_title,
            tp.opt_code,
            tp.prod_desc,
            tp.tr_place,
            tp.prod_category,
            tp.prod_type,
            tp.inventory_cnt,
            tp.test_yn,
            tp.prod_price as origin_price,
            ROUND(( SELECT (tp.prod_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) prod_price,
            tp.prod_price_tp,
            tp.lan_tp,
            tp.progress_yn,
            date_format(tp.start_date, '%Y-%m-%d') as start_date,
            date_format(tp.end_date, '%Y-%m-%d') as end_date,
            date_format(tp.reg_date, '%Y-%m-%d %H:%i:%s') as reg_date,
            (select file_name from tp_prod_file where prod_id = tp.prod_id and file_type='1') file_name,
            (select file_path from tp_prod_file where prod_id = tp.prod_id and file_type='1') file_path,
            CONCAT(date_format(tp.start_date,'%Y-%m-%d'),'~',date_format(tp.end_date,'%Y-%m-%d')) ymd_format,
            tp.package_cnt,
            tp.package_type
    FROM    tp_prod tp
    where   tp.view_yn = 'Y'
    and     tp.test_yn = 'N'
    and     tp.lan_tp = ?
    and     tp.prod_type = ?
    order by tp.reg_date desc
    `
  },
  kpopInfoList : {
    query : `SELECT a.info_seq,
                    a.info_title,
                    a.info_desc,
                    a.kpop_category,
                    a.kpop_content,
                    a.vedio_type,
                    a.lan_tp,
                    b.file_seq,
                    b.file_type,
                    b.file_category,
                    b.file_path,
                    b.file_name,
                    a.start_day,
                    a.end_day,
                    a.vedio_url,
                    CONCAT(date_format(a.start_day,'%Y-%m-%d'),'~',date_format(a.end_day,'%Y-%m-%d')) ymd_format
            FROM    tp_kpop_info a
                    left outer JOIN tp_kpop_file b ON a.info_seq = b.info_seq and file_type = '1'
            WHERE   a.lan_tp = ?
            and     a.main_vedio_yn = 'Y'
            and     a.use_yn = 'Y'
            order by sort_order asc
            `
  },
  kpopInfoDetail : {
    query : `SELECT a.info_seq,
                    a.info_title,
                    a.info_desc,
                    a.kpop_category,
                    a.kpop_content,
                    a.vedio_url,
                    a.vedio_title,
                    a.info_content,
                    a.vedio_type,
                    a.lan_tp,
                    b.file_seq,
                    b.file_type,
                    b.file_category,
                    b.file_path,
                    b.file_name,
                    a.start_day,
                    a.end_day,
                    CONCAT(date_format(a.start_day,'%Y-%m-%d'),'~',date_format(a.end_day,'%Y-%m-%d')) ymd_format,
                    a.prod_id
            FROM	  tp_kpop_info a
                    left outer join tp_kpop_file b on a.info_seq = b.info_seq
            where   a.info_seq = ?
            and     a.lan_tp = ?
            and     a.info_vedio_yn = 'Y'
            and     a.use_yn = 'Y'
            `
  },
  productDetail : {
    query : `
    select  tp.prod_id,
            tp.prod_title,
            tp.opt_code,
            tp.prod_desc,
            tp.prod_content,
            tp.tr_place,
            tp.prod_category,
            tp.prod_type,
            tp.inventory_cnt,
            tp.prod_price as origin_price,
            ROUND(( SELECT (tp.prod_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) prod_price,
            (SELECT DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ? ) deal_bas_r,
            tp.prod_price_tp,
            tp.lan_tp,
            tp.test_yn,
            tp.progress_yn,
            date_format(tp.start_date, '%Y-%m-%d') as start_date,
            date_format(tp.end_date, '%Y-%m-%d') as end_date,
            CONCAT(date_format(tp.start_date,'%Y-%m-%d'),' ~ ',date_format(tp.end_date,'%Y-%m-%d')) ymd_format,
            date_format(tp.reg_date, '%Y-%m-%d %H:%i:%s') as reg_date,
            (select file_name from tp_prod_file where prod_id = tp.prod_id and file_type='3') file_name,
            (select file_path from tp_prod_file where prod_id = tp.prod_id and file_type='3') file_path,
            tp.package_cnt,
            tp.package_type
    FROM    tp_prod tp
    where   tp.view_yn = 'Y'
    and     tp.test_yn = 'N'
    and     tp.lan_tp = ?
    and     tp.prod_id = ?
    order by tp.reg_date desc
    `
  },
  paymentInfoList : {
    query : `
        SELECT	a.prod_id,
                (select file_name from tp_prod_file where prod_id = a.prod_id and file_type='1') file_name,
                (select file_path from tp_prod_file where prod_id = a.prod_id and file_type='1') file_path,
                a.prod_title,
                a.prod_price as origin_price,
                c.cost_price as origin_cost_price,
                c.option_price as origin_opt_price,
                ROUND(( SELECT (a.prod_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) prod_price,
                ROUND(( SELECT (c.cost_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) cost_price,
                ROUND(( SELECT (c.option_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) option_price,
                c.hotel_price as origin_hotel_price,
                ROUND(( SELECT (c.hotel_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) hotel_price,
                (SELECT DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ? ) deal_bas_r,
                c.adult_cnt,
                c.teen_cnt,
                c.children_cnt,
                c.child_cnt,
                a.prod_price_tp,
                b.txn_type,
                c.cart_id,
                CONCAT(date_format(a.start_date,'%Y-%m-%d'),' ~ ',date_format(a.end_date,'%Y-%m-%d')) ymd_format,
                a.package_type
        FROM	tp_prod a
                inner join tp_reservation b ON a.prod_id = b.prod_id AND b.use_yn = 'Y' AND b.del_yn = 'N' AND b.pay_yn = 'N'
                inner join tp_mycart c ON b.prod_id = c.prod_id AND b.mem_id = c.mem_id AND b.cart_id = c.cart_id AND b.pay_yn = c.pay_yn
        WHERE	1=1
        AND		b.txn_type = ?
        AND		b.mem_id = ?
        AND		a.lan_tp = ?
        ORDER BY b.reg_date desc
    `
  },
  paymentCnt : {
    query : `
        SELECT	count(b.order_id) paymentCnt
        FROM	tp_prod a
                inner join tp_reservation b ON a.prod_id = b.prod_id AND b.use_yn = 'Y' AND b.del_yn = 'N' AND b.pay_yn = 'N'
                inner join tp_mycart c ON b.prod_id = c.prod_id AND b.mem_id = c.mem_id
        WHERE	1=1
        AND		b.txn_type = ?
        AND		b.mem_id = ?
        AND		a.lan_tp = ?
        ORDER BY b.reg_date desc
    `
  },
  mycartList : {
    query : `SELECT t1.cart_id,
                    t1.product_price as origin_price,
                    ROUND(( SELECT (t1.product_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) prod_price,
                    (SELECT DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ? ) deal_bas_r,
                    t1.cost_price as origin_cost_price,
                    ROUND(( SELECT (t1.cost_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) cost_price,
                    t1.option_price as origin_opt_price,
                    ROUND(( SELECT (t1.option_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) option_price,
                    t1.hotel_price as origin_hotel_price,
                    ROUND(( SELECT (t1.hotel_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) hotel_price,
                    t2.prod_title,
                    t2.prod_price_tp,
                    t2.prod_type,
                    t2.prod_category,
                    t2.prod_id,
                    t2.lan_tp,
                    t1.adult_cnt,
                    t1.teen_cnt,
                    t1.children_cnt,
                    t1.child_cnt,
                    DATE_FORMAT(t1.reg_date, '%Y-%m-%d %H:%i:%s') reg_date,
                    CONCAT(date_format(t2.start_date,'%Y-%m-%d'),' ~ ',date_format(t2.end_date,'%Y-%m-%d')) ymd_format,
                    (select file_name from tp_prod_file where prod_id = t2.prod_id and file_type='1') file_name,
                    (select file_path from tp_prod_file where prod_id = t2.prod_id  and file_type='1') file_path,
                    t2.opt_code as opt_code_chk,
                    t1.txn_type,
                    t2.inventory_cnt,
                    t2.package_cnt,
                    t2.package_type
              FROM   tp_mycart t1,
                    tp_prod t2
              WHERE  t1.prod_id = t2.prod_id			
              AND    t1.mem_id = ?
              AND    t2.lan_tp = ?
              AND    t1.pay_yn = 'N'
              ORDER BY t1.cart_id desc`
  },
  mycartList1 : {
    query : `SELECT t1.cart_id,
                    t1.product_price as origin_price,
                    ROUND(( SELECT (t1.product_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) prod_price,
                    (SELECT DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ? ) deal_bas_r,
                    t1.cost_price as origin_cost_price,
                    ROUND(( SELECT (t1.cost_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) cost_price,
                    t1.option_price as origin_opt_price,
                    ROUND(( SELECT (t1.option_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) option_price,
                    t1.hotel_price as origin_hotel_price,
                    ROUND(( SELECT (t1.hotel_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) hotel_price,
                    t2.prod_title,
                    t2.prod_price_tp,
                    t2.prod_type,
                    t2.prod_category,
                    t2.prod_id,
                    t2.lan_tp,
                    t1.adult_cnt,
                    t1.teen_cnt,
                    t1.children_cnt,
                    t1.child_cnt,
                    DATE_FORMAT(t1.reg_date, '%Y-%m-%d %H:%i:%s') reg_date,
                    CONCAT(date_format(t2.start_date,'%Y-%m-%d'),' ~ ',date_format(t2.end_date,'%Y-%m-%d')) ymd_format,
                    (select file_name from tp_prod_file where prod_id = t2.prod_id and file_type='1') file_name,
                    (select file_path from tp_prod_file where prod_id = t2.prod_id  and file_type='1') file_path,
                    t2.opt_code as opt_code_chk,
                    t1.txn_type,
                    t2.inventory_cnt,
                    t2.package_cnt,
                    t2.package_type
              FROM  tp_mycart t1,
                    tp_prod t2
              WHERE  t1.prod_id = t2.prod_id			
              AND    t1.cart_id = ?
              AND    t2.lan_tp = ?
              AND    t1.pay_yn = 'N'`
                
  },
  mycartChk : {
    query : `select count(prod_id) cartChk from tp_mycart where prod_id = ? and mem_id = ? AND pay_yn = 'N'`
  },
  mycartInsert : {
    query : `INSERT INTO tp_mycart set ?`
  },
  myCartUpdate  : {
    query : `update tp_mycart set ? where cart_id = ?`
  },
  mycartDelete : {
    query : `delete from tp_mycart where cart_id in (?)`
  },
  productUpdateList : {
    query : `
    select  tp.prod_id,
            tp.prod_title,
            tp.opt_code,
            tp.prod_desc,
            tp.tr_place,
            tp.prod_category,
            tp.prod_type,
            tp.inventory_cnt,
            tp.prod_price,
            tp.prod_price_tp,
            tp.lan_tp,
            tp.test_yn,
            tp.progress_yn,
            date_format(tp.start_date, '%Y-%m-%d') as start_date,
            date_format(tp.end_date, '%Y-%m-%d') as end_date,
            date_format(tp.reg_date, '%Y-%m-%d %H:%i:%s') as reg_date,
            (select file_name from tp_prod_file where prod_id = dp.prod_id and file_type='1') file_name,
            (select file_path from tp_prod_file where prod_id = dp.prod_id and file_type='1') file_path,
            tp.package_type,
            tp.package_cnt
    FROM    tp_prod tp
    where   tp.view_yn = 'Y'
    and     tp.test_yn = 'N'
    and     tp.prod_id = ?
    order by tp.reg_date desc
    `
  },
  memInfos : {
    query : `select mem_id,
                    mem_sns_id,
                    mem_nick,
                    mem_nm, 
                    mem_profile_path, 
                    sns_type, 
                    mem_token, 
                    mem_tel,
                    mem_email, 
                    reg_date,
                    use_yn,
                    company_type
              from tp_member 
              where 1=1
              and   mem_email = ?
              and   use_yn = 'Y'`
  },
  memChk : {
    query : `select mem_id,
                    mem_sns_id,
                    mem_nick,
                    mem_nm, 
                    mem_profile_path, 
                    sns_type, 
                    mem_token, 
                    mem_tel,
                    mem_email, 
                    reg_date,
                    use_yn,
                    mem_password,
                    iv,
                    mem_scpd,
                    admin_yn
            from    tp_member 
            where   1=1
            and     mem_email = ?
            and     mem_password = ?
            and     use_yn = 'Y'`
  },
  joinMemChk : {
    query : `select count(mem_email) memCnt
            from    tp_member 
            where   1=1
            and     mem_email = ?
            and     use_yn = 'Y'`
  },
  signUp: {
    // 있으면 insert 없으면 update 하라는 구문
    query : `insert into tp_member set ?`
  },
  commSequences : {
    query : `select convert(CONCAT(?, lpad(nextval(?),?,0)),char) commSeq from dual;`
  },
  grpCategoryList : {
    query : `
    SELECT  cd_group_code,
            cd_group_cn_nm,
            cd_group_en_nm,
            cd_group_vn_nm,
            cd_group_nm,
            cd_group_jp_nm,
            cd_yn
    FROM	category_group_code
    WHERE	cd_yn = 'Y'
    `
  },
  grpCategoryList1 : {
    query : `
    SELECT  cd_group_code,
            cd_group_cn_nm,
            cd_group_en_nm,
            cd_group_vn_nm,
            cd_group_nm,
            cd_group_jp_nm,
            cd_yn
    FROM	category_group_code
    WHERE	cd_yn = 'Y'
    and     cd_group_code = ?
    `
  },
  imageList : {
    query : `select * from tp_prod_file where prod_id = ?`
  },
  imageList1 : {
    query : `select * from tp_prod_file where prod_id = ? and file_type = '1'`
  },
  memInfo : {
    query : `select * from tp_member where mem_sns_id = ? and   use_yn = 'Y'`
  },
  passPortList : {
    query : `select * 
              from   tp_mem_file 
              where  prod_id = ? 
              and    mem_id = ?
              and    cart_id = ?
              order by  file_type asc, sort_order asc`
  },
  passPortDtl : {
    query : `select * 
              from   tp_mem_file 
              WHERE  1=1
              AND	cart_id = ?
              AND	mem_type = ?
              AND   sort_order = ?`
  },
  passportImageInsert : {
    query : `insert into tp_mem_file set ?`
  },
  passportImgDelete : {
    query : `delete from tp_mem_file where mem_file_id = ?`
  },
  passportImgAllDelete : {
    query : `delete from tp_mem_file where mem_id = ? and prod_id = ? and cart_id = ?`
  },
  passportImgUpdate : {
    query : `update tp_mem_file set ? where mem_file_id = ?`
  },
  reservInfoList : {
    query : `SELECT a.order_id,
                    b.rv_mem_id,
                    b.mem_nm,
                    a.tel,
                    a.email,
                    a.prod_id,
                    a.product,
                    a.mem_id,
                    a.buyername
            FROM    tp_reservation a
                    INNER JOIN tp_reservation_mem b ON a.order_id = b.order_id
            WHERE   a.use_yn = 'Y'
            AND     a.del_yn = 'N'
            AND     a.pay_yn = ?
            AND     a.txn_type = ?
            AND     a.prod_id = ?
            AND     a.mem_id = ?
            AND     a.cart_id = ?
            ORDER BY b.rv_mem_id asc`
  },
  reservInfoInsert : {
    query : `insert into tp_reservation set ?`
  },
  reservMemberInfoInsert : {
    query : `insert into tp_reservation_mem set ?`
  },
  reservInfoUpdate : {
    query : `update tp_reservation set ? where order_id = ?`
  },
  reservMemberInfoUpdate : {
    query : `update tp_reservation_mem set ? where rv_mem_id = ?`
  },
  reservInfoDelete : {
    query : `delete from tp_reservation where order_id = ?`
  },
  reservMemberInfoDelete : {
    query : `delete from tp_reservation_mem where order_id = ?`
  },
  mycartReservDelete : {
    query : `DELETE FROM tp_reservation WHERE cart_id = ?`
  },
  mycartReservMemDelete : {
    query : `delete from tp_reservation_mem where order_id =  (SELECT order_id FROM	tp_reservation WHERE	cart_id = ?)`
  },
  passPortGroupList : {
    query :  `SELECT prod_id, mem_id, cart_id, file_path
              FROM	 tp_mem_file
              WHERE	cart_id = ?
              GROUP BY prod_id, mem_id, cart_id, file_path`
  },
  productUpdate : {
    query : `update tp_prod set ? where ?`
  },
  optionMsg : {
    query : `SELECT a.*
            FROM	 tp_prod_option a
                INNER JOIN tp_prod_option_dtl b ON a.opt_code = b.opt_code AND b.opt_yn = 'Y'
            WHERE	 a.opt_yn = 'Y'
            AND	 b.opt_code_dtl IN (?)
            and   a.opt_prod_type = ?
            and   a.opt_prod_category = ?
            LIMIT 1
            `
  },
  optionList1 : {
    query : `select convert(concat(opt_code,';',opt_price),char) value, 
                    concat(opt_nm,' ',CONVERT(opt_price,char)) label,
                    opt_price
              from   tp_prod_option
              where  opt_yn = 'Y'
              and    lan_tp = ?
              `
  },
  optionList2 : {
    query : ` SELECT	convert(CONCAT(t1.opt_code_dtl,';',t1.origin_price),char) value,
                      concat(t1.opt_nm,' ',CONVERT(t1.opt_price,char)) label,
                      opt_cn_nm,
                      opt_jp_nm,
                      opt_en_nm,
                      opt_vn_nm,
                      opt_msg,
							        opt_cn_msg,
                      opt_jp_msg,
                      opt_en_msg,
                      opt_vn_msg,
                      t1.opt_code,
                      t1.opt_nm,
                      t1.opt_price,
                      t1.origin_price
              FROM    (
                      SELECT  b.opt_code,
			                        b.opt_code_dtl,
                              b.opt_cn_nm,
                              b.opt_jp_nm,
                              b.opt_en_nm,
                              b.opt_vn_nm,
                              a.opt_msg,
										          a.opt_cn_msg,
                              a.opt_jp_msg,
                              a.opt_en_msg,
                              a.opt_vn_msg,
                              b.opt_nm,
                              b.opt_price AS origin_price,
                              ROUND(( SELECT (b.opt_price / DEAL_BAS_R) FROM tp_exchange_rate WHERE CUR_UNIT = ?)) opt_price
                      FROM    tp_prod_option a
                      			INNER JOIN tp_prod_option_dtl b ON a.opt_code = b.opt_code AND b.opt_yn = 'Y'
                      WHERE   a.opt_yn = 'Y'
                      and     b.opt_code_dtl IN (?)
                ) t1`
  },
  myInfoList  :{
    query : `SELECT	po.order_id,
                    po.prod_id,
                    po.reqcur,
                    po.reqamt,
                    po.transid,
                    po.buyername,
                    po.tel,
                    po.email,
                    po.product,
                    case when po.pay_type = 'A' then 'Alipay'
                        when po.pay_type = 'W'  then 'Wechatpay'
                        when po.pay_type = 'P'  then 'PayPal'
                        ELSE 'PayPal' END AS pay_type_nm,
                    po.reqamt + IFNULL(po.vat,0) AS reqamt,
                    FORMAT(po.reqamt + IFNULL(po.vat,0),0) AS reqamt_format,
                    po.pay_type,
                    po.mem_id,
                    po.prod_total_cnt,
                    po.pay_yn,
                    tp.prod_title,
                    tm.mem_nm,
                    DATE_FORMAT(po.transdt, '%Y-%m-%d %H:%i:%s') AS transdt,
                    tp.prod_title,
                    pf.file_path,
                    pf.file_name,
                    DATE_FORMAT(po.reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date,
                    DATE_FORMAT(po.mod_date, '%Y-%m-%d %H:%i:%s') AS mod_date,
                    CONCAT(date_format(tp.start_date,'%Y-%m-%d'),' ~ ',date_format(tp.end_date,'%Y-%m-%d')) ymd_format,
                    po.cart_id,
                    tp.prod_price_tp,
                    po.txn_type
            FROM 	tp_reservation po
                    INNER JOIN	tp_member tm ON po.mem_id = tm.mem_id
                    INNER JOIN  tp_prod tp ON po.prod_id = tp.prod_id
                    INNER JOIN  tp_prod_file pf ON po.prod_id = pf.prod_id AND pf.file_type ='1'
            WHERE 	po.mem_id = ?
            AND 	po.txn_type in ('P','R','PR')
            ORDER BY po.reg_date DESC
    `
  },
  myinfoEventList : {
  query : `SELECT	a.event_rv_id,
                  a.event_id,
                  a.mem_nm,
                  a.tel,
                  a.email,
                  b.event_title,
                  b.event_desc,
                  (select file_path FROM tp_kpop_file WHERE info_seq = a.event_id and file_type = '1') file_path,
                  (select file_name FROM tp_kpop_file WHERE info_seq = a.event_id and file_type = '1') file_name,
                  DATE_FORMAT(a.reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date,
                  CONCAT(date_format(b.start_day,'%Y-%m-%d'),' ~ ',date_format(b.end_day,'%Y-%m-%d')) ymd_format
            FROM	tp_event_rv a
                  INNER JOIN  tp_event_info b ON a.event_id = b.event_id
            WHERE 	a.mem_id = ?
            and   a.application_yn = ?
            ORDER BY a.reg_date DESC
    `
  },
  orderInsert  :{
    query : `insert into tp_reservation set ?`
  },
  orderUpdate  :{
    query : `update tp_reservation set ? where order_id =?`
  },
  exchangeInsert : {
    // query : `insert into ddp_exchange_rate set ?`
    query : `insert into tp_exchange_rate set ? on duplicate key update ?`
  },
  exchangeDelete : {
    query : `delete from tp_exchange_rate`
  },
  maxCommentId : {
    query : `select max(comment_id)+1 maxId from tp_comment where prod_id = ?`
  },
  commentList : {
    query : `select comment_id,
                    comment_id,
                    prod_id,
                    user_email,
                    user_nick,
                    mem_id,
                    comment_content,
                    user_img_path,
                    like_cnt,
                    DATE_FORMAT(reg_date,'%Y-%m-%d %H:%i:%s') reg_date,
                    DATE_FORMAT(mod_date,'%Y-%m-%d %H:%i:%s') mod_date,
                    lan_tp,
                    comment_type
              from   tp_comment
              where  prod_id = ?
              and   comment_type = ?
              `
  },
  commentLikeCnt : {
    query : `
    SELECT SUM(like_cnt) like_cnt
    FROM	tp_comment
    WHERE	prod_id = ?
    and   comment_type = ?
    `
  },
  commentUpdate : {
    query : `update tp_comment set ? where comment_id = ?`
  },
  commentDelete : {
    query : `delete from tp_comment where comment_id = ?`
  },
  commentInsert : {
    query : `insert into tp_comment set ?`
  },
  commentKpopInfoList : {
    query : `select comment_id,
                    prod_id,
                    info_seq,
                    user_email,
                    user_nick,
                    comment_content,
                    user_img_path,
                    like_cnt,
                    DATE_FORMAT(reg_date,'%Y-%m-%d %H:%i:%s') reg_date,
                    DATE_FORMAT(mod_date,'%Y-%m-%d %H:%i:%s') mod_date,
                    lan_tp
              from   tp_comment
              where  info_seq = ?
              order by sort_order asc
              `
  },
  emailInsert : {
    query : `insert into tp_email_history set ?`
  },
  emailUpdate : {
    query : `update  tp_email_history set ? where order_id = ?`
  },
  orderList : {
    query : `SELECT a.order_id,
                    b.rv_mem_id,
                    b.mem_nm,
                    a.tel,
                    a.email,
                    a.prod_id,
                    (select prod_title from tp_prod where prod_id = a.prod_id) product,
                    a.mem_id,
                    a.buyername,
                    a.txn_type,
                    a.pay_yn,
                    a.transdt,
                    a.transid,
                    FORMAT(a.reqamt + IfNULL(a.vat,0),0) AS reqamt_format,
                    a.reqamt + IfNULL(a.vat,0) reqamt
            FROM    tp_reservation a
                    INNER JOIN tp_reservation_mem b ON a.order_id = b.order_id
            WHERE   a.use_yn = 'Y'
            AND     a.del_yn = 'N'
            AND     a.pay_yn = ?
            AND     a.txn_type = ?
            AND     a.prod_id = ?
            AND     a.mem_id = ?
            AND     a.order_id = ?
            ORDER BY b.rv_mem_id asc`
  },
  eventInfoList : {
    query : `SELECT a.event_id,
                    a.event_title,
                    a.event_desc,
                    a.event_category,
                    a.event_content,
                    a.vedio_url,
                    a.vedio_title,
                    a.lan_tp,
                    b.file_seq,
                    b.file_type,
                    b.file_category,
                    b.file_path,
                    b.file_name,
                    a.use_yn,
                    a.vedio_type,
                    a.start_day,
                    a.end_day,
                    CONCAT(date_format(a.start_day,'%Y-%m-%d'),' ~ ',date_format(a.end_day,'%Y-%m-%d')) ymd_format
              FROM	tp_event_info a 
                    INNER JOIN tp_kpop_file b ON a.event_id = b.info_seq
              where a.lan_tp = ?
              and   a.use_yn = 'Y'
              `
  },
  eventInfoDtl : {
    query : `SELECT a.event_id,
                    a.event_title,
                    a.event_desc,
                    a.event_category,
                    a.event_content,
                    a.vedio_url,
                    a.vedio_title,
                    a.lan_tp,
                    b.file_seq,
                    b.file_type,
                    b.file_category,
                    b.file_path,
                    b.file_name,
                    b.info_seq,
                    a.use_yn,
                    a.vedio_type,
                    a.start_day,
                    a.end_day,
                    CONCAT(date_format(a.start_day,'%Y-%m-%d'),'~',date_format(a.end_day,'%Y-%m-%d')) ymd_format,
                    a.event_total_cnt,
                    a.personnel_cnt
            FROM	tp_event_info a 
                  INNER JOIN tp_kpop_file b ON a.event_id = b.info_seq
            where 1=1
            and   a.event_id = ?
            and   a.lan_tp = ?
          `
  },
  communityList : {
    query : `
            SELECT	a.cou_id,
                    a.event_id,
                    a.cou_se_cd,
                    (SELECT cd_name FROM tp_code WHERE a.cou_se_cd = com_cd_code and com_cd_group_code =  ?) cou_se_cd_nm,
                    a.cou_ttl_nm,
                    a.cou_content,
                    a.lan_tp,
                    a.inq_cnt,
                    a.rls_yn,
                    a.cou_bgng_ymd,
                    a.cou_end_ymd,
                    CONCAT(a.cou_bgng_ymd,'~',a.cou_end_ymd) cou_ymd_format,
                    a.popup_yn,
                    a.popup_bgng_ymd,
                    a.popup_end_ymd,
                    CONCAT(a.popup_bgng_ymd,'~',a.popup_end_ymd) popup_ymd_format,
                    a.reg_date,
                    a.mod_date,
                    a.use_yn
            FROM	tp_community a
            where   1=1
            and     a.lan_tp = ?
            and     ?
            order by a.reg_date desc
            
    `
  },
  communityDtl : {
    query : `
            SELECT	a.cou_id,
                    a.event_id,
                    a.cou_se_cd,
                    (SELECT cd_name FROM tp_code WHERE a.cou_se_cd = com_cd_code and com_cd_group_code =  ?) cou_se_cd_nm,
                    a.cou_ttl_nm,
                    a.cou_content,
                    a.lan_tp,
                    a.inq_cnt,
                    a.rls_yn,
                    a.cou_bgng_ymd,
                    a.cou_end_ymd,
                    CONCAT(a.cou_bgng_ymd,'~',a.cou_end_ymd) cou_ymd_format,
                    a.popup_yn,
                    a.popup_bgng_ymd,
                    a.popup_end_ymd,
                    CONCAT(a.popup_bgng_ymd,'~',a.popup_end_ymd) popup_ymd_format,
                    a.reg_date,
                    a.mod_date,
                    a.use_yn
            FROM		tp_community a
            where   a.cou_id = ?
    `
  },
  kpopImageList : {
    query : `
            select  *
            from    tp_kpop_file
            where   info_seq = ?
    `
  },
  eventReservList : {
    query : `select a.event_rv_id,
                    b.event_rv_mem_id,
                    b.mem_nm,
                    a.tel,
                    a.email,
                    a.event_id,
                    a.mem_id,
                    a.participant_cnt,
                    a.application_yn
                FROM    tp_event_rv a
                    INNER JOIN tp_event_rv_mem b ON a.event_rv_id = b.event_rv_id
                WHERE   a.use_yn = 'Y'
                AND     a.del_yn = 'N'
                AND     a.event_id = ?
                AND     a.mem_id = ?
                AND     a.application_yn != ?
                ORDER BY b.event_rv_mem_id ASC`
  },
  eventReservCnt : {
    query : `
            SELECT  count(ifnull(t1.event_rv_mem_id,0)) rvCnt
            FROM	  (
                    SELECT b.event_rv_mem_id AS event_rv_mem_id
                    FROM   tp_event_rv a
                            INNER JOIN tp_event_rv_mem b ON a.event_rv_id = b.event_rv_id
                    WHERE  a.event_id = ?
                    AND    a.mem_id = ?
            )t1
    `
  },
  eventReservInsert : {
    query : `insert into tp_event_rv set ?`
  },
  eventReservMemInsert : {
    query : `insert into tp_event_rv_mem set ?`
  },
  eventReservUpdate : {
    query : `update tp_event_rv set ? where event_rv_id = ?`
  },
  eventReservMemUpdate : {
    query : `update tp_event_rv_mem set ? where event_rv_mem_id = ?`
  },
  eventReservDelete : {
    query : `delete from tp_event_rv where event_rv_id = ?`
  },
  eventReservMemDelete : {
    query : `delete from tp_event_rv_mem where ?`
  },
  eventInfoUpdate : {
    query : `update tp_event_info set ? where event_id = ?`
  },
  eventPassPortList :{
    query : `select * 
              from   tp_event_mem_file 
              where  event_id = ? 
              and    mem_id = ?
              order by  sort_order asc,file_type asc`        
  },
  eventPassportCnt : {
    query : `
            SELECT 	COUNT(a.sort_order) imgGroupCnt
            FROM    (SELECT sort_order
                    from   tp_event_mem_file
                    where  event_id = ?
                    and    mem_id = ?
                    group by  sort_order)a
    `
  },
  eventPassPortDtl : {
    query : `select * 
              from   tp_event_mem_file 
              WHERE  1=1
              AND	event_id = ?
              AND sort_order = ?`
  },
  eventPassPortIsert : {
    query : `insert into tp_event_mem_file set ?`
  },
  eventPassPortDelete : {
    query : `delete from tp_event_mem_file where event_mem_file_id = ?`
  },
  eventPassPortUpdate : {
    query : `update tp_event_mem_file set ? where event_mem_file_id = ?`
  },
  eventPassPortAllDelete : {
      query : `delete from tp_event_mem_file where mem_id=? and event_id=?`
  },
  optionDtlInsert: {
    // 중복키 없으면 insert 있으면 update 하라는 구문
    query : `insert into tp_option_dtl set ? on duplicate key update ?`
  },
  optionDtlList: {
    query : `select convert(CONCAT(t1.opt_code,';',t1.origin_price),char) value, 
                    t1.opt_name as label,
                    t1.opt_code,
                    t1.opt_name,
                    t1.opt_price,
                    t1.origin_price,
                    t1.cart_id,
                    t1.mem_id,
                    t1.participant_cnt,
                    t1.opt_id,
                    t1.prod_id
            FROM		(
                    SELECT 	a.opt_name as label,
                            a.opt_code,
                            a.opt_name,
                            a.opt_price AS origin_price,
                            ROUND(( SELECT (a.opt_price / DEAL_BAS_R) FROM tp_exchange_rate WHERE CUR_UNIT = ?)) opt_price,
                            b.cart_id,
                            b.mem_id,
                            a.participant_cnt,
                            a.opt_id,
                            b.prod_id
                    from    tp_option_dtl a
                            INNER join tp_mycart b ON a.cart_id = b.cart_id AND a.mem_id = b.mem_id AND b.pay_yn = 'N'
                    WHERE  1=1
                    AND		a.mem_id = ?
            )t1`
  },
  optionDtl: {
    query : `select convert(CONCAT(t1.opt_code,';',t1.origin_price),char) value, 
                    t1.opt_name as label,
                    t1.opt_code,
                    t1.opt_name,
                    t1.opt_price,
                    t1.origin_price,
                    t1.cart_id,
                    t1.mem_id,
                    t1.participant_cnt,
                    t1.opt_id,
                    t1.prod_id
            FROM		(
                    SELECT 	a.opt_name as label,
                            a.opt_code,
                            a.opt_name,
                            a.opt_price AS origin_price,
                            ROUND(( SELECT (a.opt_price / DEAL_BAS_R) FROM tp_exchange_rate WHERE CUR_UNIT = ?)) opt_price,
                            b.cart_id,
                            b.mem_id,
                            a.participant_cnt,
                            a.opt_id,
                            b.prod_id
                    from    tp_option_dtl a
                            INNER join tp_mycart b ON a.cart_id = b.cart_id AND a.mem_id = b.mem_id AND b.pay_yn = 'N'
                    WHERE  1=1
                    AND		a.mem_id = ?
                    AND   b.cart_id = ?
            )t1`
  },
  paymentOptionList: {
    query : `select convert(CONCAT(a.opt_code,';',a.opt_price),char) value, 
                  a.opt_name as label,
                  a.opt_code,
                  a.opt_name,
                  a.opt_price,
                  b.cart_id,
                  b.mem_id,
                  a.participant_cnt,
                  a.opt_id,
                  b.prod_id
              from   tp_option_dtl a
                  INNER join tp_mycart b ON a.cart_id = b.cart_id AND a.mem_id = b.mem_id AND b.pay_yn = 'N'
                  INNER join tp_reservation c ON b.cart_id = c.cart_id and c.mem_id = b.mem_id AND c.pay_yn = 'N'
              WHERE  1=1
              AND		a.mem_id = ?
              AND   c.txn_type = ?
              `
              
    // select * from tp_option_dtl where cart_id = ? and mem_id = ?`
  },
  optionDtlDelete : {
    query : `delete from tp_option_dtl where opt_id = ?`
  },
  optionDtlAllDelete : {
    query : `delete from tp_option_dtl where cart_id =?`
  },
  monitorHistory : {
    query : `insert into tp_monitor_history set ?`
  },
  loginUpdate : {
    query : `update tp_member set ? where mem_sns_id = ?`
  },
  loginHisUpdate : {
    query : `update tp_member set ? where mem_email = ?`
  },
  idFind : {
    query : `select mem_email 
             from   tp_member
             where  mem_nm = ?
             and    mem_tel = ?
    `
  },
  passwordFind : {
    query : `select mem_password 
             from   tp_member
             where  mem_nm = ?
             and    mem_tel = ?
             and    mem_email = ?
    `
  },
  qnaList : {
    query : `
    SELECT	qna_id,
            mem_id,
            (select mem_nm from tp_member where a.mem_id = mem_id and use_yn = 'Y') mem_nm,
            qna_ttl_nm,
            qna_content,
            secret_yn,
            answer_yn,
            lan_tp,
            qna_date,
            answer_date,
            date_format(qna_date,'%Y.%m.%d') qna_ymd_format,
            date_format(answer_date,'%Y.%m.%d') answer_ymd_format,
            reg_date,
            qna_password
    FROM		tp_qna a	
    WHERE		lan_tp = ?
    `
  },
  qnaChkDetail : {
    query : `
    SELECT	qna_id,
            mem_id,
            (select mem_nm from tp_member where a.mem_id = mem_id and use_yn = 'Y') mem_nm,
            qna_ttl_nm,
            qna_content,
            qna_answer_content,
            secret_yn,
            answer_yn,
            lan_tp,
            qna_date,
            answer_date,
            date_format(qna_date,'%Y.%m.%d') qna_ymd_format,
            date_format(answer_date,'%Y.%m.%d') answer_ymd_format,
            reg_date
    FROM		tp_qna a	
    WHERE		lan_tp = ?
    and     qna_id = ?
    and     mem_id = ?
    and     qna_password = ?
    `
  },
  qnaDetail : {
    query : `
    SELECT	qna_id,
            mem_id,
            (select mem_nm from tp_member where a.mem_id = mem_id and use_yn = 'Y') mem_nm,
            qna_ttl_nm,
            qna_content,
            qna_answer_content,
            secret_yn,
            answer_yn,
            lan_tp,
            qna_date,
            answer_date,
            date_format(qna_date,'%Y.%m.%d') qna_ymd_format,
            date_format(answer_date,'%Y.%m.%d') answer_ymd_format,
            reg_date
    FROM		tp_qna a	
    WHERE		lan_tp = ?
    and     qna_id = ?
    and     mem_id = ?
    `
  },
  qnaInsert : {
    query : `insert into tp_qna set ?`
  },
  qnaUpdate : {
    query : `update tp_qna set ? where qna_id = ?`
  },
  qnaDelete : {
    query : `delete from tp_qna where qna_id = ?`
  },
  memberDelete : {
    query : `update tp_member where mem_id = ? and use_yn = 'N'`
  },
  productPackageList : {
    query : `select prod_id,
                    package_type,
                    ROUND(( SELECT (prod_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) prod_price,
                    prod_price_tp
              from  tp_prod
              where lan_tp = ?
              and   prod_type = ?
              and   prod_category = ?
              and   view_yn = 'Y'
              and   test_yn = 'N'
              order by reg_date desc
    `
  },
  hotelDtlList : {
    query : `SELECT   DISTINCT
                      c.hotel_dtl_id,
                      c.hotel_type,
                      ROUND(( SELECT (c.hotel_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) hotel_price,
                      c.hotel_price as origin_hotel_price,
                      c.hotel_ko_price_type,
                      c.hotel_en_price_type,
                      c.hotel_cn_price_type,
                      c.hotel_jp_price_type,
                      c.hotel_vn_price_type,
                      c.hotel_nm,
                      c.hotel_en_nm,
                      c.hotel_cn_nm,
                      c.hotel_jp_nm,
                      c.hotel_vn_nm,
                      c.hotel_type_nm,
                      c.hotel_en_type_nm,
                      c.hotel_cn_type_nm,
                      c.hotel_jp_type_nm,
                      c.hotel_vn_type_nm,
                      c.lan_tp,
                      c.use_yn,
                      c.del_yn
            FROM      tp_prod a
                      INNER JOIN tp_hotel b ON a.prod_type = b.prod_type AND a.prod_category = b.prod_category AND b.use_yn = 'Y'
                      INNER JOIN tp_hotel_dtl c on b.hotel_id = c.hotel_id and b.use_yn = 'Y'
            where   1=1
            and     a.view_yn = 'Y'
            and     a.test_yn = 'N'
            AND	  a.prod_type = ?
            AND	  a.prod_category = ?
            order by c.hotel_dtl_id ASC
            `
  },
  hotelCartInsert : {
    query : `insert into tp_hotel_cart_dtl set ?`
  },
  hotelCartUpdate : {
    query : `update tp_hotel_cart_dtl set ? where hotel_cart_id = ?`
  },
  hotelCartList : {
    query : `select * from tp_hotel_cart_dtl`
  },
  hotelCartDtlList : {
    query : `select b.hotel_cart_id,
                    b.cart_id,
                    b.mem_id,
                    b.hotel_dtl_id,
                    b.hotel_type_nm,
                    b.hotel_type,
                    ROUND(( SELECT (b.hotel_price) / DEAL_BAS_R FROM tp_exchange_rate WHERE SUBSTRING(CUR_UNIT,1,3) = ?)) hotel_price,
                    b.hotel_price as origin_hotel_price,
                    b.personnel_cnt
              from  tp_mycart a,
                    tp_hotel_cart_dtl b
              where 1=1
              and   a.cart_id = b.cart_id
              and   a.cart_id = ?
              AND   a.pay_yn = 'N'
              
              `
  },
  hotelCartDelete : {
    query : `delete from tp_hotel_cart_dtl where cart_id = ?`
  },
  customNation : {
    query : `
            SELECT b.* 
            FROM 	tp_code a
                INNER JOIN tp_code b ON a.com_cd_group_code = b.cd_code1 and a.cd_type = b.cd_code2
            where a.cd_type = ?
            AND b.cd_code1 = ?
            AND b.cd_yn = 'Y'
    `
  },
  getCode : {
    query :
      `select * 
       from   tp_code a
              inner join tp_group_code b on a.com_cd_group_code = b.com_cd_group_code and b.cd_yn = 'Y'
       where  a.cd_yn ='Y' and a.com_cd_group_code = ?`
  },
  getCodeGroup : {
    query : `SELECT t2.*
              FROM	(
                  SELECT * 
                  FROM 	tp_code
                  WHERE	com_cd_group_code = ?
                  ORDER BY com_cd_group_code, com_cd_code
                  ) T1
                  INNER JOIN (
                          SELECT *
                          FROM	tp_code
                  ) t2 ON t1.com_cd_group_code = t2.cd_code1
              WHERE	t1.cd_yn = 'Y'	     
              AND	t2.cd_yn = 'Y'
              GROUP BY t2.com_cd_code, com_cd_group_code, cd_code1, cd_code2 
              ORDER BY t2.com_cd_group_code, com_cd_code`
  },
  companyDtl : {
    query : `select * from tp_company_info where lan_tp = ?`
  },
}
