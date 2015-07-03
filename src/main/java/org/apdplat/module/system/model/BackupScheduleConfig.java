package org.apdplat.module.system.model;

import org.apdplat.platform.annotation.IgnoreBusinessLog;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.apdplat.platform.annotation.Database;
import org.apdplat.platform.annotation.ModelAttr;
import org.apdplat.platform.model.SimpleModel;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Entity
@Scope("prototype")
@Component
@IgnoreBusinessLog
@Table(name="APDP_LOG_BACKUPSCHEDULECONFIG")
@Database
public class BackupScheduleConfig extends SimpleModel{
    @ModelAttr("定时备份的小时（0-23）")
    protected int scheduleHour=2;
    @ModelAttr("定时备份的分钟（0-59）")
    protected int scheduleMinute=2;
    @ModelAttr("是否启用定时备份")
    protected boolean enabled=true;

    public int getScheduleHour() {
        return scheduleHour;
    }

    public void setScheduleHour(int scheduleHour) {
        this.scheduleHour = scheduleHour;
    }

    public int getScheduleMinute() {
        return scheduleMinute;
    }

    public void setScheduleMinute(int scheduleMinute) {
        this.scheduleMinute = scheduleMinute;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    @Override
    public String getMetaData() {
        return "定时备份数据配置";
    }
}