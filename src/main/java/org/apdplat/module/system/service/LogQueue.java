package org.apdplat.module.system.service;

import java.util.concurrent.ConcurrentLinkedQueue;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apdplat.platform.log.APDPlatLogger;
import org.apdplat.platform.model.Model;
import org.apdplat.platform.service.ServiceFacade;
import org.springframework.stereotype.Service;

/**
 *
 * @author sun
 */
@Service
public class LogQueue {
	protected static final APDPlatLogger LOG = new APDPlatLogger(LogQueue.class);
	// 使用日志数据库
	@Resource(name = "serviceFacadeForLog")
	private ServiceFacade serviceFacade;
	private static ConcurrentLinkedQueue<Model> logs = new ConcurrentLinkedQueue<>();
	private static int logQueueMax = Integer.parseInt(PropertyHolder
			.getProperty("logQueueMax"));

	public static synchronized void addLog(Model log) {
		logs.add(log);
		if (logs.size() > logQueueMax) {
			queue.saveLog();
		}
	}

	private static LogQueue queue = null;

	public static LogQueue getLogQueue() {
		return queue;
	}

	@PostConstruct
	public void execute() {
		queue = this;
	}

	public synchronized void saveLog() {
		int len = logs.size();
		int success = 0;
		LOG.info("保存前队列中的日志数目为(Num. of log before saving in the queue)：" + len);
		try {
			for (int i = 0; i < len; i++) {
				Model model = logs.remove();
				try {

					serviceFacade.create(model);

					success++;
				} catch (Exception e) {
					LOG.error(
							"保存日志失败(Failed to save log):" + model.getMetaData(),
							e);
				}
			}
		} catch (Exception e) {
			LOG.error("保存日志抛出异常(Saving log exception)", e);
		}
		LOG.info("成功保存(Success to save) " + success + " 条日志(log)");
		LOG.info("保存后队列中的日志数目为(Num. of log after saving in the queue)："
				+ logs.size());
	}

	public synchronized void updateLog(Model log) {
		logs.add(log);
		if (logs.size() == 0 ) {
			//queue.saveLog();
			return;
		}
		int len = logs.size();
		int success = 0;
		LOG.info("保存前队列中的日志数目为(Num. of log before saving in the queue)：" + len);
		try {
			for (int i = 0; i < len; i++) {
				Model model = logs.remove();
				try {
					serviceFacade.update(model);
					success++;
				} catch (Exception e) {
					LOG.error(
							"保存日志失败(Failed to save log):" + model.getMetaData(),
							e);
				}
			}
		} catch (Exception e) {
			LOG.error("保存日志抛出异常(Saving log exception)", e);
		}
		LOG.info("成功保存(Success to save) " + success + " 条日志(log)");
		LOG.info("保存后队列中的日志数目为(Num. of log after saving in the queue)："
				+ logs.size());
	}
}